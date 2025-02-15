import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  user = {
    name: "",
    eMail: "",
    password: "",
    secondPassword: ""
  };
  stateLogin : boolean = true;
  authSucceeded : boolean = true;
  privacyAccepted: boolean = false;

  constructor (private authService: AuthService) {

  }

  toggleSignUp() {
    this.stateLogin = !this.stateLogin;
  }

  signUp() {
    console.log("hi");
    
  }

  logIn() {
    this.authSucceeded = this.authService.checkAuth(this.user.eMail, this.user.password);
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
