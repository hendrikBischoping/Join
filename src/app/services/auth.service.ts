import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase-service.service';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInAnonymously, updateProfile } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { getDoc, setDoc } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private authSubject = new BehaviorSubject<boolean>(false);
  auth$ = this.authSubject.asObservable();
  private userName = 'Guest';

  constructor(private firebaseService: FirebaseService, private auth: Auth) { }


  async registerUser(name: string, email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, {displayName: name});
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
        this.userName = userCredential.user.displayName ?? "Guest";
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
  }

  async successAuth() {
    try {
      const userCredential = await signInAnonymously(this.auth);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: 'Guest' });
        this.userName = 'Guest';
        this.authSubject.next(true);
      }
    } catch (error) {
      console.error('Guest login failed:', error);
    }
  }

  getUserName() {
    return this.userName;
  }
}

// getUsers() {
//   return this.firebaseService.UserList;
// }

// getUserName() {
//   return this.userName;
// }

// async addUser(user: IUser) {
//   await this.firebaseService.addToDB(this.collectionName, user);
// }

// checkAuth(mail: string, pw: string): boolean {
//   const users = this.getUsers();
//   const isAuthenticated = users.some(user => user.eMail == mail && user.password == pw);
//   this.authSubject.next(isAuthenticated);

//   return isAuthenticated;
// }

// forceAuth() {
//   this.authSubject.next(true);
// }