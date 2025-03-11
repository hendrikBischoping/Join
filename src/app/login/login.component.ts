import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

/**
 * Component for user login and registration.
 */
export class LoginComponent {
  @Output() topicSelected = new EventEmitter<string>()
  user = {
    name: '',
    email: '',
    phone: 0,
    password: '',
    secondPassword: ''
  };
  rememberMe: boolean = false;
  stateLogin: boolean = true;
  authSucceeded: boolean = true;
  privacyAccepted: boolean = false;
  privacyAcceptedMismatch: boolean = false;
  tryRegister: boolean = false;
  registrationSuccess: boolean = false;
  passwordMismatch: boolean = false;
  logoTransition: boolean = false;
  isVisible: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    setTimeout(() => {
      this.logoTransition = true;
      this.isVisible = true;
    }, 100);

    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedEmail && savedPassword) {
      this.user.email = savedEmail;
      this.user.password = savedPassword;
      this.rememberMe = true;
    }
  }

  /**
   * Toggles between login and registration mode.
   */
  toggleSignUp() {
    this.stateLogin = !this.stateLogin;
  }

  /**
   * Handles the login or registration form submission.
   * @param form The submitted form.
   */
  async onSubmit(form: NgForm) {
    if (form.invalid) {
      this.tryRegister = true;
      return;
    }

    if (!this.privacyAccepted) {
      this.privacyAcceptedMismatch = true;
      return;
    }
    this.privacyAcceptedMismatch = false;

    if (this.user.password !== this.user.secondPassword) {
      this.passwordMismatch = true;
      return;
    }
    this.passwordMismatch = false;
    
    const result = await this.authService.registerUser(this.user.name, this.user.email, this.user.password);
    if (result) {
      this.registrationSuccess = true;
      setTimeout(() => this.stateLogin = true, 2000);
    }
  }

  /**
   * Logs the user in.
   */
  async logIn() {
    const user = await this.authService.loginUser(this.user.email, this.user.password);
    this.authSucceeded = !!user;
    if (this.authSucceeded) {
      if (this.rememberMe) {
        localStorage.setItem('rememberedEmail', this.user.email);
        localStorage.setItem('rememberedPassword', this.user.password);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
      }
    } else {
      setTimeout(() => (this.authSucceeded = true), 1800);
    }
  }

  /**
   * Confirms successful authentication.
   */
  successAuth() {
    this.authService.successAuth();
  }

  /**
   * Scrolls to the top of the page.
   */
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Selects a topic and emits it to the parent component.
   * @param topic The selected topic.
   */
  selectTopic(topic: string) {
    this.topicSelected.emit(topic);
    this.scrollToTop();
  }
}