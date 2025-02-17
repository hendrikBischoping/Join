import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { IUser } from '../interfaces/iuser';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  user = {
    name: '',
    email: '',
    phone: 0,
    password: '',
    secondPassword: ''
  };
  stateLogin: boolean = true;
  authSucceeded: boolean = true;
  privacyAccepted: boolean = false;
  registrationSuccess: boolean = false;
  passwordMismatch: boolean = false;

  constructor(private authService: AuthService) { }

  toggleSignUp() {
    this.stateLogin = !this.stateLogin;
  }

  async onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    if (this.user.password !== this.user.secondPassword) {
      this.passwordMismatch = true;
      return;
    }
    this.passwordMismatch = false;

    const newUser: IUser = {
      name: this.user.name,
      eMail: this.user.email,
      password: this.user.password
    };

    await this.authService.addUser(newUser).then(() => {
      this.registrationSuccess = true;
      setTimeout(() => {
        this.stateLogin = true;
      }, 2000);

    });

  }

  logIn() {
    this.authSucceeded = this.authService.checkAuth(this.user.email, this.user.password);
    if (!this.authSucceeded) {
      setTimeout(() => {
        this.authSucceeded = true;
      }, 1800);
    }

  }

  successAuth() {
    this.authService.forceAuth();
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
