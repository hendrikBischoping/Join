import { isDataSource } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ITask } from '../../interfaces/itask'; 
import { TaskDataService } from '../../services/task-data.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule],
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

  taskCategories: { category: string }[] = [
    { category: 'Technical Task' },
    { category: 'User Story' }
  ];

  saveDateTestArray: string[] = [];

  prioUrgent = false;
  prioMedium = true;
  prioLow = false;

  task: ITask =
  {
    title: 'Testtitel',
    description: 'Test 2',
    contacts: ['8W3sjYScAi0V0h38A6Hj', '8e1QzZ3rKZod5ovZ2Tpi'],
    date: '10.10.2020',
    priority: 'Medium',
    category: 'User Story',
    subtasks: [
      {subtaskName: 'Board fertigstellen', subtaskDone: false},
      {subtaskName: 'Add-Task fertigstellen', subtaskDone: true}
    ],
    status: 'todo',
    id: '',
  }

  taskAdded = false;
  constructor(private taskDataService: TaskDataService,) {};

  setPriority(priority: 'prioUrgent' | 'prioMedium' | 'prioLow') {
    this.prioUrgent = false;
    this.prioMedium = false;
    this.prioLow = false;
    this[priority] = true; 
    return this[priority] = true;
  }

  getDate() {
    let dateData: string = this.task.date ? new Date(this.task.date).toLocaleDateString('en-US') : '';      
    return dateData;
  }

  async submitTask(form: NgForm) {
      if (form.valid && form.submitted) {
        this.getDate();
     }
    this.taskAdded = true;
    
  // const newTask: ITask = {
  //   title: this.task.title,
  //   description: this.task.description,
  //   contacts: this.task.contacts,
  //   date: this.task.date,
  //   priority: 'Medium',
  //   category: this.task.category,
  //   subtasks: this.task.subtasks,
  //   status: 'To do',
  //   id: this.task.id,
  // }
  
  this.task.contacts =  ['8W3sjYScAi0V0h38A6Hj', '8e1QzZ3rKZod5ovZ2Tpi'],
  this.task.subtasks = [
    {subtaskName: 'Board fertigstellen', subtaskDone: false},
    {subtaskName: 'Add-Task fertigstellen', subtaskDone: true}
  ];
  
  await this.taskDataService.addTask(this.task).then(() => {
    this.taskAdded = false;
    form.resetForm();
  })
  console.log(this.task);
  
}
}
