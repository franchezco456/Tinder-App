import { Injectable } from '@angular/core';
import { Auth as AuthFire, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  constructor(private readonly afb: AuthFire) { }

  async register(register: FormGroup) {
    try {
      if (!register.value.email) {
        throw new Error('Email is required');
      }
      if (!register.value.password) {
        throw new Error('Password is required');
      }
      const response = await createUserWithEmailAndPassword(
        this.afb,
        register.value.email,
        register.value.password
      )
      return response
    } catch (error) {
      console.error('Error registering user:', error);
      return;
    }
  }

  async loginWithEmailAndPassword(login: FormGroup) {
    try {
      if (!login.value.email) {
        throw new Error('Email is required');
      }
      if (!login.value.password) {
        throw new Error('Password is required');
      }

      const response = await signInWithEmailAndPassword(
        this.afb,
        login.value.email,
        login.value.password
      );
      return response
    } catch (error) {
      console.error('Error logging in user:', error);
      return;
    }
  }

}


