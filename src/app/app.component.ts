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
  limitedAccessState : string = "login";
  currentRoute : string = "summarytest";

  constructor(private authService: AuthService, 
      private cdRef: ChangeDetectorRef,) {}

  ngOnInit() {
    this.authService.auth$.subscribe((authStatus) => {
      this.authenticated = authStatus;
    })
    this.authService.userName$.subscribe(name => {
      this.userName = name;
      this.userInitials = this.getUserInitials(name)    
    });
  }
setCurrentRoute (name:string){
  this.currentRoute = name;
}

  getUserInitials(name: string) {
    if (!name) return "";
    const words = name.trim().split(/\s+/);
    return words.map(word => word[0].toUpperCase()).join("");
  }

  toggleSmallMenu(event: Event) {
    event.stopPropagation();
    this.isSmallMenuOpen = !this.isSmallMenuOpen;

    if (this.isSmallMenuOpen) {
      document.addEventListener('click', this.closeSmallMenu);
    } else {
      document.removeEventListener('click', this.closeSmallMenu);
    }
  }

  closeSmallMenu = (event: Event) => {
    const menu = document.querySelector('.editButtom');
    if (menu && !menu.contains(event.target as Node)) {
      this.isSmallMenuOpen = false;
      document.removeEventListener('click', this.closeSmallMenu);
      this.cdRef.detectChanges();
    }
  };

  changeTopic(topic: string) {
    this.limitedAccessState = topic;
  }
}
