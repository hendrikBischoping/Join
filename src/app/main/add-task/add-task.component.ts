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
    title: '',
    description: '',
    contacts: [],
    date: '',
    priority: '',
    category: '',
    subtasks: [],
    status: '',
    id: '',
  }

  taskAdded = false;
  constructor(private taskDataService: TaskDataService,) {};

  setPriority(priority: 'prioUrgent' | 'prioMedium' | 'prioLow') {
    this.prioUrgent = false;
    this.prioMedium = false;
    this.prioLow = false;
    this[priority] = true;  
    console.log(this.task.category);    
    return this[priority] = true;
  }

  getDate() {
    let dateData: string = this.task.date ? new Date(this.task.date).toLocaleDateString('en-US') : ''; 
    //this.saveDateTestArray.push(newDate)
    // console.log(dateData);      
    return dateData;
  }

  async submitTask(form: NgForm) {
      if (form.valid && form.submitted) {
        this.getDate();
     }
    this.taskAdded = true;
    
  const newTask: ITask = {
    title: this.task.title,
    description: this.task.description,
    // contacts: form.value.contacts,
    contacts: this.task.contacts,
    date: this.task.date,
    priority: 'medium',
    category: this.task.category,
    subtasks: this.task.subtasks,
    status: 'open',
    id: this.task.id,
  }
  console.log(newTask);
  await this.taskDataService.addTask(newTask).then(() => {
    setTimeout(() => {
      this.taskAdded = false;
      form.resetForm();
    }, 2000);
  })

  }
}
