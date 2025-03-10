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
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { FirebaseService } from '../../services/firebase-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CdkDropList, CdkDrag, CdkDropListGroup, CommonModule, FormsModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  tasks: ITask[] = [{
    title: "Unknown",
    description: "No task found",
    contacts: ["Andi", "Hendrik"],
    date: '0',
    priority: "mid",
    category: "Userstory",
    subtasks: [],
    status: "todo",
    id: ""
  }];
  contacts!: IContact[];
  boardRows = ["todo", "inProgress", "awaitFeedback", "done"]
  data = inject(FirebaseService)
  searchQuery = "";
  highlightedColumn: string | null = null;
  isDragging = false;

  constructor(private taskDataService: TaskDataService, private contactService: ContactService, private overlayService: OverlayService) { }

  ngOnInit() {
    this.contactService.getContacts().subscribe((contactList) => {
      this.contacts = contactList;
    });
    this.taskDataService.getTasks().subscribe((taskList) => {
      this.tasks = taskList;
    });
  }

  /**
   * Gibt die Aufgaben für eine bestimmte Statusreihe zurück.
   * @param status Der Status der Aufgabenreihe.
   * @returns Eine Liste von Aufgaben im angegebenen Status.
   */
  getRowData(status: string): ITask[] {
    let tasks: ITask[];
    switch (status) {
      case "todo": tasks = this.data.todo; break;
      case "inProgress": tasks = this.data.inProgress; break;
      case "awaitFeedback": tasks = this.data.awaitFeedback; break;
      case "done": tasks = this.data.done; break;
      default: tasks = this.tasks;
    }

    return tasks.map(task => ({
      ...task,
      contacts: task.contacts?.filter(contact => contact?.trim() !== '') || []
    }));
  }

  /**
   * Filtert die Aufgaben basierend auf der Suchanfrage.
   * @param status Der Status der Aufgabenreihe.
   * @returns Eine gefilterte Liste von Aufgaben.
   */
  getFilteredTasks(status: string): ITask[] {
    return this.getRowData(status).filter(task =>
      task.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      task.description?.toLocaleLowerCase().includes(this.searchQuery.toLocaleLowerCase())
    );
  }

  /**
   * Gibt den Anzeigenamen für eine bestimmte Statusreihe zurück.
   * @param status Der Status der Aufgabenreihe.
   * @returns Der Anzeigename der Aufgabenreihe.
   */
  getRowName(status: string): string {
    switch (status) {
      case "todo": return "To Do";
      case "inProgress": return "In Progress";
      case "awaitFeedback": return "Await Feedback";
      case "done": return "Done";
      default: return "Empty";
    }
  }

  /**
   * Gibt die Anzahl der erledigten Unteraufgaben für eine Aufgabe zurück.
   * @param task Die Aufgabe, deren Unteraufgaben überprüft werden.
   * @returns Die Anzahl der erledigten Unteraufgaben.
   */
  getDoneSubtask(task: ITask) {
    if (!task.subtasks || task.subtasks.length === 0) return 0;
    return task.subtasks.filter(subtask => subtask.subtaskDone).length;
  }

  /**
   * Berechnet den Fortschritt einer Aufgabe basierend auf den Unteraufgaben.
   * @param task Die Aufgabe, deren Fortschritt berechnet wird.
   * @returns Der Fortschritt in Prozent.
   */
  getProgress(task: ITask): number {
    const doneSubtasks = this.getDoneSubtask(task);
    return (doneSubtasks / task.subtasks!.length) * 100;
  }

  /**
   * Überprüft, ob die Kategorie einer Aufgabe "User Story" ist.
   * @param task Die zu überprüfende Aufgabe.
   * @returns Wahr, wenn die Kategorie "User Story" ist, andernfalls falsch.
   */
  checkCategory(task: ITask) {
    return task.category === "User Story";
  }

  /**
   * Hervorheben einer Spalte beim Drag & Drop.
   * @param columnId Die ID der hervorgehobenen Spalte.
   */
  onDragEntered(columnId: string) {
    this.highlightedColumn = columnId;
  }

  /**
   * Entfernt die Hervorhebung der Spalte beim Verlassen des Drag & Drop.
   */
  onDragExited() {
    this.highlightedColumn = null;
  }

  /**
   * Behandelt das Ablegen einer Aufgabe in einer neuen Spalte.
   * @param event Das Drag & Drop-Ereignis.
   */
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
    this.highlightedColumn = null;
  }

  /**
   * Gibt den Pfad zu einem Bild basierend auf der Priorität einer Aufgabe zurück.
   * @param task Die Aufgabe, deren Priorität überprüft wird.
   * @param prio Die Priorität, die überprüft wird.
   * @param forceInactive Gibt an, ob das Bild als inaktiv angezeigt werden soll.
   * @returns Der Pfad zum Bild.
   */
  getPrioImagePath(task: ITask, prio: string, forceInactive = false): string {
    if (forceInactive) {
      return `./assets/img/add-task/${prio.toLowerCase()}-inactive.png`;
    } else {
      return task.priority === prio
        ? `./assets/img/add-task/${prio.toLowerCase()}-active.png`
        : `./assets/img/add-task/${prio.toLowerCase()}-inactive.png`;
    }
  }

  /**
   * Ändert die Priorität einer Aufgabe.
   * @param task Die Aufgabe, deren Priorität geändert werden soll.
   * @param prio Die neue Priorität.
   */
  changePriority(task: ITask, prio: string) {
    task.priority = prio;
  }

  /**
   * Überprüft, ob eine Priorität aktiv ist.
   * @param task Die Aufgabe, deren Priorität überprüft wird.
   * @param prio Die zu überprüfende Priorität.
   * @returns Wahr, wenn die Priorität aktiv ist, andernfalls falsch.
   */
  isPriorityActive(task: ITask, prio: string): boolean {
    return task.priority === prio;
  }

  /**
   * Öffnet den Bearbeitungsdialog für eine Aufgabe.
   * @param id Die ID der zu bearbeitenden Aufgabe.
   */
  openEditDialog(id: string) {
    this.overlayService.openEditTaskOverlay(id);
  }

  /**
   * Öffnet den Dialog zum Hinzufügen einer Aufgabe.
   * @param status Der Status der neuen Aufgabe (standardmäßig "todo").
   */
  openAddTaskDialog(status = "todo") {
    this.overlayService.openAddTaskOverlay(status);
  }
}

