import { Component } from '@angular/core';
import { ContactFloatingComponent } from './contact-floating/contact-floating.component';


import { ContactListComponent } from './contact-list/contact-list.component';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [ContactFloatingComponent, ContactListComponent],

  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {

}
