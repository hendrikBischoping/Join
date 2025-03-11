import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthService } from './services/auth.service';
import { PrivacyPolicyComponent } from './main/privacy-policy/privacy-policy.component';
import { LegalNoticeComponent } from './main/legal-notice/legal-notice.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, LoginComponent, PrivacyPolicyComponent, LegalNoticeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'join';
  authenticated = true;
  userName: string = 'Guest';
  userInitials: string = '';
  isSmallMenuOpen: boolean = false;
  limitedAccessState: string = "login";
  currentRoute: string = "summary";

  /**
   * Creates an instance of the AppComponent.
   * @param authService - The authentication service
   * @param cdRef - ChangeDetectorRef for manual change detection
   */
  constructor(private authService: AuthService, private cdRef: ChangeDetectorRef) {}

  /**
   * Initializes the component and sets subscriptions for authentication and username.
   */
  ngOnInit() {
    this.authService.auth$.subscribe((authStatus) => {
      this.authenticated = authStatus;
    });

    this.authService.userName$.subscribe(name => {
      this.userName = name;
      this.userInitials = this.getUserInitials(name);
    });
  }
  
  /**
   * Sets the current route.
   * @param name - Name of the new route
   */
  setCurrentRoute(name: string) {
    this.currentRoute = name;
  }

  /**
   * Gets the initials of a username.
   * @param name - The full name of the user
   * @returns The user's initials in uppercase
   */
  getUserInitials(name: string): string {
    if (!name) return "";
    const words = name.trim().split(/\s+/);
    return words.map(word => word[0].toUpperCase()).join("");
  }

  /**
   * Toggles the small menu open or closed.
   * @param event - The click event to prevent closing by other clicks
   */
  toggleSmallMenu(event: Event) {
    event.stopPropagation();
    this.isSmallMenuOpen = !this.isSmallMenuOpen;

    if (this.isSmallMenuOpen) {
      document.addEventListener('click', this.closeSmallMenu);
    } else {
      document.removeEventListener('click', this.closeSmallMenu);
    }
  }

  /**
   * Closes the small menu if clicked outside.
   * @param event - The click event
   */
  closeSmallMenu = (event: Event) => {
    const menu = document.querySelector('.editButtom');
    if (menu && !menu.contains(event.target as Node)) {
      this.isSmallMenuOpen = false;
      document.removeEventListener('click', this.closeSmallMenu);
      this.cdRef.detectChanges();
    }
  };

  /**
   * Changes the current topic in limited access mode.
   * @param topic - The new topic
   */
  changeTopic(topic: string) {
    this.limitedAccessState = topic;
  }

  /**
   * Logs out the user and reloads the window.
   */
  async logout() {
    await this.authService.logout();
    this.authenticated = false;
    window.location.reload();
  }
}