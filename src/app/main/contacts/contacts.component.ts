import { Component } from '@angular/core';
import { ContactListComponent } from './contact-list/contact-list.component';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [ContactListComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {

}
