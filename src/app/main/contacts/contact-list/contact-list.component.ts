import { ChangeDetectorRef, Component, EventEmitter, inject, Output } from '@angular/core';
import { ContactService } from '../../../services/contact-service.service';
import { IContact } from '../../../interfaces/icontact';
import { MatDialog } from '@angular/material/dialog';
import { IsActiveMatchOptions } from '@angular/router';
import { AddContactDialogComponent } from '../add-contact-dialog/add-contact-dialog.component';
import { OverlayService } from '../../../services/overlay.service';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss'
})

/**
 * Represents a component that displays a list of contacts.
 */
export class ContactListComponent {
  @Output() contactSelected = new EventEmitter<string>();
  
  groupedContacts: { letter: string; contacts: IContact[] }[] = [];
  
  contactsFromList: IContact[] = [];  
  readonly dialog = inject(MatDialog);

  constructor(private contactService: ContactService, private cdRef: ChangeDetectorRef, private overlayService: OverlayService) {
    setTimeout(() => {
      this.groupContacts();
    }, 1000);
  }
  
  /**
   * Lifecycle Hook: Called when the component is initialized.
   * Subscribes to the contact list and groups the contacts upon receipt.
   */
  ngOnInit() {
    this.contactService.getContacts().subscribe((contactList) => {
      this.contactsFromList = contactList;
      this.groupContacts();
      this.cdRef.detectChanges();
    });
  }

  /**
   * Groups contacts by the first letter of their name.
   * Sorts contacts alphabetically and then creates groups.
   */
  groupContacts() {
    const sortedContacts = this.contactsFromList.sort((a, b) => a.name.localeCompare(b.name));
    const groups = sortedContacts.reduce((acc, contact) => {
      const letter = contact.name.charAt(0).toLowerCase();
      if (!acc[letter]) {
        acc[letter] = [];
      }
      acc[letter].push(contact);
      return acc;
    }, {} as { [key: string]: IContact[] });

    this.groupedContacts = Object.keys(groups).sort().map(letter => ({
      letter, contacts: groups[letter]
    }));
  }

  /**
   * Opens the overlay to add a new contact.
   */
  addContact() {
    this.overlayService.openAddContactOverlay();
  }

  /**
   * Selects a contact and emits the ID of the selected contact through the EventEmitter object.
   * @param contactId - The ID of the selected contact.
   */
  selectContact(contactId: string) {
    this.contactSelected.emit(contactId);
  }
}