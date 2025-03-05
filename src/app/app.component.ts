import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'join';
  authenticated = true;
  userName: string = 'Guest';
  userInitials: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.auth$.subscribe((authStatus) => {
      this.authenticated = authStatus;
    })
    this.authService.userName$.subscribe(name => {
      this.userName = name;
      this.userInitials = this.getUserInitials(name)    
    });
  }

  getUserInitials(name: string) {
    if (!name) return "";
    const words = name.trim().split(/\s+/);
    return words.map(word => word[0].toUpperCase()).join("");
  }
}
