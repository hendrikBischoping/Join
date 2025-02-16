import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase-service.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private collectionName = 'User';

  constructor(private firebaseService: FirebaseService) { }
  private authSubject = new BehaviorSubject<boolean>(false);
  auth$ = this.authSubject.asObservable();

  getUsers() {
    return this.firebaseService.UserList;
  }

  checkAuth(mail: string, pw: string): boolean {
    const users = this.getUsers();
    
    const isAuthenticated = users.some(user => user.eMail == mail && user.password == pw);
    
    this.authSubject.next(isAuthenticated);
    return isAuthenticated;
  }

  forceAuth() {
    this.authSubject.next(true);
  }
}
