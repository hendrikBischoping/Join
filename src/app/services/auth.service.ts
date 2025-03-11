import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from './firebase-service.service';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInAnonymously, updateProfile, User, onAuthStateChanged, setPersistence, browserLocalPersistence } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** BehaviorSubject, das den Authentifizierungsstatus speichert (angemeldet/nicht angemeldet). */
  private authSubject = new BehaviorSubject<boolean>(false);
  auth$ = this.authSubject.asObservable();

  /** BehaviorSubject, das den Benutzernamen speichert. */
  private userNameSubject = new BehaviorSubject<string>('Guest');
  userName$ = this.userNameSubject.asObservable(); // Öffentliches Observable für den Usernamen

  constructor(private firebaseService: FirebaseService, private auth: Auth, private router: Router) {
    this.initializeAuthState();
  }

  private initializeAuthState() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.authSubject.next(true);
        this.userNameSubject.next(user.displayName ?? 'Guest');
      } else {
        this.authSubject.next(false);
        this.userNameSubject.next('Guest');
      }
    });
  }

  /**
   * Registriert einen neuen Benutzer mit E-Mail und Passwort.
   * @param name - Der Name des Benutzers.
   * @param email - Die E-Mail-Adresse des Benutzers.
   * @param password - Das Passwort des Benutzers.
   * @returns Das Benutzer-Objekt oder null im Falle eines Fehlers.
   */
  async registerUser(name: string, email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
        this.userNameSubject.next(name);
      }
      return userCredential.user;
    } catch (error) {
      console.error('Registration Error:', error);
      return null;
    }
  }

  /**
   * Meldet einen Benutzer mit E-Mail und Passwort an.
   * @param email - Die E-Mail-Adresse des Benutzers.
   * @param password - Das Passwort des Benutzers.
   * @returns Das Benutzer-Objekt oder null im Falle eines Fehlers.
   */
  async loginUser(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      if (userCredential.user) {
        const userName = userCredential.user.displayName ?? "Guest";
        this.userNameSubject.next(userName);
      }
      this.authSubject.next(true);
      this.router.navigate(['/summary']);
      return userCredential.user;
    } catch (error) {
      console.error('Login Error:', error);
      return null;
    }
  }

  /**
   * Meldet den aktuellen Benutzer ab.
   */
  async logout() {
    await signOut(this.auth);
    this.authSubject.next(false);
    this.userNameSubject.next('Guest');
  }

  /**
   * Meldet einen anonymen Gastbenutzer an.
   * Setzt den Benutzernamen auf 'Guest' und aktualisiert den Authentifizierungsstatus.
   */
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

  /**
   * Gibt den aktuellen Benutzernamen zurück.
   * @returns Der Benutzername des aktuell angemeldeten Benutzers.
   */
  getUserName() {
    return this.userNameSubject.getValue();
  }
}
