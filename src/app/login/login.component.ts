import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
// import { IUser } from '../interfaces/iuser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
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
   * Wechselt zwischen Anmeldungs- und Registrierungsmodus.
   */
  toggleSignUp() {
    this.stateLogin = !this.stateLogin;
  }

  /**
   * Verarbeitet das Anmelde- oder Registrierungsformular.
   * @param form Das Formular, das übermittelt wird.
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
   * Meldet den Benutzer an.
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
   * Bestätigt die erfolgreiche Authentifizierung.
   */
  successAuth() {
    this.authService.successAuth();
  }

  /**
   * Scrollt zur Oberseite der Seite.
   */
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Wählt ein Thema aus und gibt es an die übergeordnete Komponente weiter.
   * @param topic Das ausgewählte Thema.
   */
  selectTopic(topic: string) {
    this.topicSelected.emit(topic);
    this.scrollToTop();
  }
}