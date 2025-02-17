import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase-service.service';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../interfaces/iuser';

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

  async addUser(user: IUser) {
    await this.firebaseService.addToDB(this.collectionName, user);
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
