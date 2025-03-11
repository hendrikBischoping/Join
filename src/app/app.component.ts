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
   * Erstellt eine Instanz der AppComponent.
   * @param authService - Der Authentifizierungsservice
   * @param cdRef - ChangeDetectorRef für manuelles Change Detection
   */
  constructor(private authService: AuthService, private cdRef: ChangeDetectorRef) {}

  /**
   * Initialisiert die Komponente und setzt Abonnements für Authentifizierung und Benutzername.
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
   * Setzt die aktuelle Route.
   * @param name - Name der neuen Route
   */
  setCurrentRoute(name: string) {
    this.currentRoute = name;
  }

  /**
   * Ermittelt die Initialen eines Benutzernamens.
   * @param name - Der vollständige Name des Benutzers
   * @returns Die Initialen des Benutzers in Großbuchstaben
   */
  getUserInitials(name: string): string {
    if (!name) return "";
    const words = name.trim().split(/\s+/);
    return words.map(word => word[0].toUpperCase()).join("");
  }

  /**
   * Öffnet oder schließt das kleine Menü.
   * @param event - Das Click-Event, um das Schließen durch andere Klicks zu verhindern
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
   * Schließt das kleine Menü, wenn außerhalb geklickt wird.
   * @param event - Das Click-Event
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
   * Ändert das aktuelle Thema im eingeschränkten Zugriffsmodus.
   * @param topic - Das neue Thema
   */
  changeTopic(topic: string) {
    this.limitedAccessState = topic;
  }


  async logout() {
    await this.authService.logout();
    this.authenticated = false;
    window.location.reload();
  }
}
