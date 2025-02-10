import { Component } from '@angular/core';
<<<<<<< HEAD
import { ContactFloatingComponent } from './contact-floating/contact-floating.component';


=======
import { ContactListComponent } from './contact-list/contact-list.component';
>>>>>>> fbfb272363ca49597e3520f272238ae783a576d1

@Component({
  selector: 'app-contacts',
  standalone: true,
<<<<<<< HEAD
  imports: [ContactFloatingComponent],
=======
  imports: [ContactListComponent],
>>>>>>> fbfb272363ca49597e3520f272238ae783a576d1
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {

}
