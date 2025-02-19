import { Component } from '@angular/core';
import { ITask } from '../../interfaces/itask';
import { TaskDataService } from '../../services/task-data.service';
import { ContactService } from '../../services/contact-service.service';
import { IContact } from '../../interfaces/icontact';
import { OverlayService } from '../../services/overlay.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  tasks: ITask[] = [{
    title: "Unknown",
    description: "No task found",
    contacts: ["Andi","Hendrik"],
    date: 0,
    priority: "mid",
    category: "Userstory",
    subtasks: ["Do Nothing", "turn around"],
    status: "todo",
    id: ""
  }];
  contacts!: IContact[];

  constructor(private taskDataService: TaskDataService, private contactService: ContactService, private overlayService: OverlayService) {

  }

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
}
