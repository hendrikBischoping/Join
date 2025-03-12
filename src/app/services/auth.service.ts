import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from './firebase-service.service';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInAnonymously, updateProfile, User, onAuthStateChanged, setPersistence, browserLocalPersistence } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

/**
 * Service for managing authentication and user login.
 */
export class AuthService {
  /** BehaviorSubject that stores the authentication status (logged in/not logged in). */
  private authSubject = new BehaviorSubject<boolean>(false);
  auth$ = this.authSubject.asObservable();

  /** BehaviorSubject that stores the username. */
  private userNameSubject = new BehaviorSubject<string>('Guest');
  userName$ = this.userNameSubject.asObservable(); // Public observable for the username

  /**
   * Constructor to initialize the AuthService.
   * @param firebaseService - The service for interacting with Firebase.
   * @param auth - The authentication service from Firebase.
   * @param router - The router for navigation.
   */
  constructor(private firebaseService: FirebaseService, private auth: Auth, private router: Router) {
    this.initializeAuthState();
  }

  /**
   * Initializes the authentication state based on the current user.
   */
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
   * Registers a new user with email and password.
   * @param name - The name of the user.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns The user object or null in case of an error.
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
   * Logs in a user with email and password.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns The user object or null in case of an error.
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
   * Logs out the current user.
   */
  async logout() {
    await signOut(this.auth);
    this.authSubject.next(false);
    this.userNameSubject.next('Guest');
  }

  /**
   * Logs in an anonymous guest user.
   * Sets the username to 'Guest' and updates the authentication status.
   */
  async successAuth() {
    try {
      const userCredential = await signInAnonymously(this.auth);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: 'Guest' });
        this.userNameSubject.next('Guest');
        this.router.navigate(['/summary']);
        this.authSubject.next(true);
      }
    } catch (error) {
      console.error('Guest login failed:', error);
    }
  }

  /**
   * Returns the current username.
   * @returns The username of the currently logged-in user.
   */
  getUserName() {
    return this.userNameSubject.getValue();
  }
}
