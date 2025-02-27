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
  boardRows = ["todo","inProgress", "awaitFeedback", "done"]
 

 
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

  getRowData(status: string) : ITask[] {
    switch (status) {
      case "todo": return this.data.todo;
      case "inProgress": return this.data.inProgress;
      case "awaitFeedback": return this.data.awaitFeedback;
      case "done": return this.data.done;
      default: return this.tasks;
    }
  }

  getRowName (status: string) : string {
    switch (status) {
      case "todo": return "To Do";
      case "inProgress": return "In Progress";
      case "awaitFeedback": return "Await Feedback";
      case "done": return "Done";
      default: return "Empty";
    }
  }

  getDoneSubtask(task: ITask) {
    if (!task.subtasks || task.subtasks.length === 0) return 0;
    return task.subtasks.filter(subtask => subtask.subtaskDone).length;
  }

  getProgress(task: ITask): number {
    const doneSubtasks = this.getDoneSubtask(task);
    return (doneSubtasks / task.subtasks!.length) * 100; // Berechnet Prozentwert
}
 
  checkCategory(task: ITask) {
    return task.category == "User Story" ?  true : false;
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
      this.data.updateTaskStatus(currentTask.id!, event.container.id);
    }
  }

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

  openEditDialog(id:string) {
    this.overlayService.openEditTaskOverlay(id);
  }

  openAddTaskDialog (status = "todo") {
    this.overlayService.openAddTaskOverlay(status);
  }
}

