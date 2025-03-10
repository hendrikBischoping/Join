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
export class ContactListComponent {
  @Output() contactSelected = new EventEmitter<string>()
  groupedContacts: {letter: string; contacts: IContact[]}[] = [];
  
  contactsFromList: IContact[] = [];  
  readonly dialog = inject(MatDialog);

  constructor(private contactService: ContactService, private cdRef: ChangeDetectorRef, private overlayService: OverlayService) {
    setTimeout(() => {
      this.groupContacts();
    }, 1000);
  }
  
  /**
   * Lifecycle Hook: Wird bei der Initialisierung der Komponente aufgerufen.
   * Abonniert die Kontaktliste und gruppiert die Kontakte nach dem Empfang.
   */
  ngOnInit() {
    this.contactService.getContacts().subscribe((contactList) => {
      this.contactsFromList = contactList;
      this.groupContacts();
      this.cdRef.detectChanges();
    });
  }

  /**
   * Gruppiert die Kontakte nach dem Anfangsbuchstaben ihres Namens.
   * Sortiert die Kontakte zuerst alphabetisch und erstellt dann Gruppen.
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
   * Öffnet das Overlay zum Hinzufügen eines neuen Kontakts.
   */
  addContact() {
    this.overlayService.openAddContactOverlay();
  }

  /**
   * Wählt einen Kontakt aus und gibt die ID des ausgewählten Kontakts über das EventEmitter-Objekt aus.
   * @param contactId - Die ID des ausgewählten Kontakts.
   */
  selectContact(contactId: string) {
    this.contactSelected.emit(contactId);
  }
}
