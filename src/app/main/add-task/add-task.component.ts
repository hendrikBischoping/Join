import { Component } from '@angular/core';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {
  placeholderListContacts = [
    {
      name: 'Andreas',
      initials: 'AW',
    },
    {
      name: 'Sascha',
      initials: 'ST',
    },
    {
      name: 'Hendrik',
      initials: 'HB',
    },
  ];
  placeholderListCategories = [
    {
      category: 'Technical Task'
    },
    {
      category: 'User Story'
    },
  ]
}
