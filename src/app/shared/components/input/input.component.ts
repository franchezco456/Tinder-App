import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

type InputType = 'text' |'password'| 'email' | 'number' | 'date';
@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  standalone: false,
})
export class InputComponent  implements OnInit {
  @Input() label : string = '';
  @Input() placeholder : string = '';
  @Input() type : InputType = 'text';
  @Input() control : AbstractControl | null = new FormControl();

  constructor() { }

  ngOnInit() {}

  public doWrite(event: any){
    if (this.control) {
      this.control.setValue(event.target.value);
      console.log(this.control.value);
    }
  }

}
