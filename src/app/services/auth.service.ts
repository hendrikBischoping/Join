import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase-service.service';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInAnonymously, updateProfile, User } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authSubject = new BehaviorSubject<boolean>(false);
  auth$ = this.authSubject.asObservable();
  
  private userNameSubject = new BehaviorSubject<string>('Guest');
  userName$ = this.userNameSubject.asObservable(); // Öffentliches Observable für den Usernamen

  constructor(private firebaseService: FirebaseService, private auth: Auth) { }

  async registerUser(name: string, email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, {displayName: name});
        this.userNameSubject.next(name);
      }
      return userCredential.user;
    } catch (error) {
      console.error('Registration Error:', error);
      return null;
    }
  }

  async loginUser(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      if (userCredential.user) {
        const userName = userCredential.user.displayName ?? "Guest";
        this.userNameSubject.next(userName);
      }
      this.authSubject.next(true);
      return userCredential.user;
    } catch (error) {
      console.error('Login Error:', error);
      return null;
    }
  }

  async logout() {
    await signOut(this.auth);
    this.authSubject.next(false);
    this.userNameSubject.next('Guest'); // Zurücksetzen des Namens auf "Guest"
  }

  async successAuth() {
    try {
      const userCredential = await signInAnonymously(this.auth);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: 'Guest' });
        this.userNameSubject.next('Guest');
        this.authSubject.next(true);
      }
    } catch (error) {
      console.error('Guest login failed:', error);
    }
  }

  getUserName() {
    return this.userNameSubject.getValue(); // Gibt den aktuellen Wert zurück
  }
}