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

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CdkDropList, CdkDrag, CdkDropListGroup],
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
  
  task: ITask = {
    title: "Unknown",
    description: "No task found",
    contacts: ["Andi", "Hendrik"],
    date: '0',
    priority: "mid",
    category: "Userstory",
    subtasks: [{
      subtaskName: "",
      subtaskDone: false,
    }
    ],
    status: "todo",
    id: ""
  };
  previewTask: ITask = {
    title: "",
    description: "",
    contacts: [],
    date: '0',
    priority: "mid",
    category: "",
    subtasks: [],
    status: "",
    id: ""
  };

  isUserStory = false;
  initTask() {
    if (this.task.category == "User Story") {
      this.isUserStory = true;
    }
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
  getPrioImagePath(prio: string, forceInactive = false): string {
    if (forceInactive) {
      return `./assets/img/add-task/${prio.toLowerCase()}-inactive.png`;
    } else
      return this.previewTask.priority === prio
        ? `./assets/img/add-task/${prio.toLowerCase()}-active.png`
        : `./assets/img/add-task/${prio.toLowerCase()}-inactive.png`;
  }

  changePriority(prio: string) {
    this.previewTask.priority = prio;
  }
  isPriorityActive(prio: string): boolean {
    return this.previewTask.priority === prio;
  }

  openAddTaskDialog () {
    
  }
}

