import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {provideFirebaseApp, initializeApp, getApp} from "@angular/fire/app"
import { environment } from 'src/environments/environment.prod';
import { Auth } from './providers/auth/auth';
import { getAuth, provideAuth } from '@angular/fire/auth';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    provideFirebaseApp(() => initializeApp((environment.FIREBASE))),
    provideAuth(() => getAuth()),
    Auth
  ]
})
export class CoreModule { }
