import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from 'src/app/core/providers/auth/auth';
import { Images } from 'src/app/shared/services/images/images';
import { Credentials } from 'src/domain/model/credentials.model';
import { User } from 'src/domain/model/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {
  public page: number = 0;
  public gender: string = '';
  public registerForm !: FormGroup;
  public ageError: string = '';
  public urls: string[] = [];




  constructor(private formBuilder: FormBuilder, private readonly routerSrv : Router,private readonly imageSrv: Images, private readonly authSrv: Auth) {
    this.initForm();
  }

  ngOnInit() {
    this.registerForm.get('birthdate')?.valueChanges.subscribe(() => {
      this.registerForm.get('birthdate')?.markAsTouched();
    });
  }

  async changePage(next: boolean) {
    if (next && this.isPageValid()) {
      this.page++;
    } else if (!next) {
      this.page--;
    }
    if (this.page == 4) {
      await this.imageSrv.loadImagesFromUser(this.registerForm.get('email')?.value).then(urls => {
        this.urls = urls;
      });
      this.registerForm.get('photos')?.setValue(this.urls);
    }
    console.log(this.registerForm.value);
  }

  public selectGender(value: string) {
    this.gender = value;
    this.registerForm.get('gender')?.setValue(value);
  }

  public isPageValid(): boolean {
    if (this.page === 0) {
      const requiredFields = ['firstName', 'lastName', 'email', 'password', 'country'];
      return requiredFields.every(field => {
        const control = this.registerForm.get(field);
        return control && control.valid;
      });
    }
    if (this.page === 1) {
      const genderControl = this.registerForm.get('gender');
      return !!(genderControl && genderControl.valid && genderControl.value !== '');
    }
    if (this.page === 2) {
      const birthdateControl = this.registerForm.get('birthdate');
      return !!(birthdateControl && birthdateControl.valid);
    }
    return true;
  }


  private ageValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const birthDate = new Date(control.value);
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();


    const exactAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ? age - 1
      : age;

    if (exactAge < 18) {
      return { underage: { requiredAge: 18, currentAge: exactAge } };
    }

    return null;
  }

  public getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email';
      }
      if (field.errors['minlength']) {
        return `Password must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['underage']) {
        return `You must be at least 18 years old. Current age: ${field.errors['underage'].currentAge}`;
      }
    }
    return '';
  }

  private initForm() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      country: ['', [Validators.required]],
      showGenderProfile: [false, [Validators.required]],
      gender: ['', [Validators.required]],
      birthdate: ['', [Validators.required, this.ageValidator.bind(this)]],
      passion: [[], [Validators.required]],
      photos: [[], [Validators.required]]
    });
  }
  public selectInterest(value: string) {
    const passionsControl = this.registerForm.get('passion');
    if (passionsControl) {
      const currentValues = passionsControl.value || [];
      if (currentValues.includes(value)) {
        passionsControl.setValue(currentValues.filter((v: string) => v !== value));
      } else {
        passionsControl.setValue([...currentValues, value]);
      }
      passionsControl.markAsTouched();
    }
  }

  public isPassionSelected(value: string): boolean {
    const passionsControl = this.registerForm.get('passion');
    if (!passionsControl) return false;
    const currentValues = passionsControl.value || [];
    return currentValues.indexOf(value) !== -1;
  }

  public async selectImages() {
    const image = await this.imageSrv.uploadImage(this.registerForm.get('email')?.value);
    this.registerForm.get('photos')?.setValue([...this.registerForm.get('photos')?.value, image]);
    this.urls.push(image);
    console.log('Selected image:', image);
    console.log(this.registerForm);
  }

  private formToUser(form: FormGroup): User {
    const raw = form.value;
    return {
      uid: "",
      name: raw.firstName,
      lastName: raw.lastName,
      email: raw.email,
      birthDate: raw.birthdate,
      country: raw.country,
      gender: raw.gender,
      showGenderProfile: !!raw.showGenderProfile,
      passions: (raw.passions || []).map((p: string) => ({ category: p })),
      photos: raw.photos || []
    };
  }

  private formToCredential(form: FormGroup): Credentials {
    const raw = form.value;
    return {
      email: raw.email,
      password: raw.password
    };
  }


  public async onSubmit() {
    console.log('Form submitted:', this.registerForm.value);
    const user = this.formToUser(this.registerForm);
    const credentials = this.formToCredential(this.registerForm);
    const response = await this.authSrv.register(credentials, user);
    if(response) {
      console.log(response);
      await this.routerSrv.navigate(['/login']);
    }
  }


}
