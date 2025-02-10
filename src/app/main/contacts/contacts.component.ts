import { Component } from '@angular/core';
import { ContactFloatingComponent } from './contact-floating/contact-floating.component';



@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [ContactFloatingComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {

}
