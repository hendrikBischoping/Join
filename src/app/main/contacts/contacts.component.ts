import { Component } from '@angular/core';
import { ContactFloatingComponent } from './contact-floating/contact-floating.component';

import { ContactListComponent } from './contact-list/contact-list.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [ContactFloatingComponent, ContactListComponent, CommonModule],

  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})

/**
 * Represents a component for managing and displaying contacts.
 */
export class ContactsComponent {
  selectedContactId: string = '';
  slideLeft = false;

  /**
   * Selects a contact by ID and toggles the slide list visibility.
   * @param id - The ID of the selected contact.
   */
  selectContact(id: string) {
    this.selectedContactId = id;
    this.toggleSlideList();
  }

  /**
   * Toggles the visibility of the slide list.
   */
  toggleSlideList() {
    this.slideLeft = !this.slideLeft;
  }
}

