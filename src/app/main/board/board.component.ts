import { Component, inject } from '@angular/core';
import { ITask } from '../../interfaces/itask';
import { TaskDataService } from '../../services/task-data.service';
import { ContactService } from '../../services/contact-service.service';
import { IContact } from '../../interfaces/icontact';
import { OverlayService } from '../../services/overlay.service';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { FirebaseService } from '../../services/firebase-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CdkDropList, CdkDrag, CdkDropListGroup,CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  tasks: ITask[] = [{
    title: "Unknown",
    description: "No task found",
    contacts: ["Andi","Hendrik"],
    date: '0',
    priority: "mid",
    category: "Userstory",
    subtasks: [],
    status: "todo",
    id: ""
  }];
  contacts!: IContact[];
  
 

 
  initTask() {
   
  }

  constructor(private taskDataService: TaskDataService, private contactService: ContactService, private overlayService: OverlayService) {

  }
  data = inject(FirebaseService)

  ngOnInit() {
    this.contactService.getContacts().subscribe((contactList) => {
      this.contacts = contactList;
    });
    this.taskDataService.getTasks().subscribe((taskList) => {
      this.tasks = taskList;
    });
  }
 
  checkCategory(task: ITask) {
    return task.category == "User Story" ?  true : false;
  }

  openEditDialog(id:string) {
    this.overlayService.openEditTaskOverlay(id);
  }

  drop(event: CdkDragDrop<ITask[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const currentTask = event.container.data[event.currentIndex];

      // console.log("Task ID ", currentTask.id);
      // console.log("Old status ", currentTask.status);
      // console.log("New status ", event.container.id);

      // Update the status of the task in the database (Parameter: taskId, newStatus)
      this.data.updateTaskStatus(currentTask.id!, event.container.id);
      
    }
  }

  // drop(event: CdkDragDrop<string[]>) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex,
  //     );
  //   }
  // }
  getPrioImagePath(task:ITask, prio: string, forceInactive = false): string {
    if (forceInactive) {
      return `./assets/img/add-task/${prio.toLowerCase()}-inactive.png`;
    } else
      return task.priority === prio
        ? `./assets/img/add-task/${prio.toLowerCase()}-active.png`
        : `./assets/img/add-task/${prio.toLowerCase()}-inactive.png`;
  }

  changePriority(task:ITask, prio: string) {
    task.priority = prio;
  }
  isPriorityActive(task:ITask, prio: string): boolean {
    return task.priority === prio;
  }

  openAddTaskDialog () {
    
  }
}

