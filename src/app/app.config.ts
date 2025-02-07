import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"join-f8360","appId":"1:982335821033:web:9fc96c8f3a4f9ee8828c78","storageBucket":"join-f8360.firebasestorage.app","apiKey":"AIzaSyBc1im1vE_w_mPoyzTAPcrYa0u_Pq_ctwI","authDomain":"join-f8360.firebaseapp.com","messagingSenderId":"982335821033"}))), importProvidersFrom(provideAuth(() => getAuth())), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
