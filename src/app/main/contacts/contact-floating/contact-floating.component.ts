import { ChangeDetectorRef, Component, inject, Input, EventEmitter, Output } from '@angular/core';
import { IContact } from '../../../interfaces/icontact';
import { ContactService } from '../../../services/contact-service.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { OverlayService } from '../../../services/overlay.service';

@Component({
  selector: 'app-contact-floating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-floating.component.html',
  styleUrl: './contact-floating.component.scss',
})
export class ContactFloatingComponent {
  @Output() slideListToggled = new EventEmitter<void>();
  @Input() watchTarget: string = "";
  contactsFromList: IContact[] = [
    {
      name: 'Hendrik Bischoping',
      eMail: 'hbischoping@googlemail.com',
      phone: 31245,
    },
  ];
  readonly dialog = inject(MatDialog);
  isEditMenuOpen: boolean = false;

  constructor(
    private contactService: ContactService,
    private cdRef: ChangeDetectorRef,
    private overlayService: OverlayService
  ) { }

  ngOnInit() {
    this.contactService.getContacts().subscribe((contactList) => {
      this.contactsFromList = contactList;
    });
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.closeEditMenu);
  }

  toggleEditMenu(event: Event) {
    event.stopPropagation();
    this.isEditMenuOpen = !this.isEditMenuOpen;

    if (this.isEditMenuOpen) {
      document.addEventListener('click', this.closeEditMenu);
    } else {
      document.removeEventListener('click', this.closeEditMenu);
    }
  }

  closeEditMenu = (event: Event) => {
    const menu = document.querySelector('.editButtom');
    if (menu && !menu.contains(event.target as Node)) {
      this.isEditMenuOpen = false;
      document.removeEventListener('click', this.closeEditMenu);
      this.cdRef.detectChanges();
    }
  };

  editData(contactId?: string) {
    this.isEditMenuOpen = false;
    this.cdRef.detectChanges();
  
    const selectedContact = this.contactsFromList.find(
      (contact) => contact.id === contactId
    );
    if (!selectedContact) {
      console.error('Contact not found!');
      return;
    }
  
    this.overlayService.openEditContactOverlay(selectedContact);
  }
  deleteData(contactId?: string) {
    this.isEditMenuOpen = false;
    this.cdRef.detectChanges();
    this.contactService.deleteContact(contactId!);
  }

  toggleSlideList() {
    this.slideListToggled.emit();
  }
}
