import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {provideFirebaseApp, initializeApp, getApp} from "@angular/fire/app"
import { environment } from 'src/environments/environment.prod';
import { Auth } from './providers/auth/auth';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { Query } from './services/query/query';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    provideFirebaseApp(() => initializeApp((environment.FIREBASE))),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    Auth, Query
  ]
})
export class CoreModule { }
