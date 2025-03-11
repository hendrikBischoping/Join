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

/**
 * Component for displaying the task board
 */
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
   * Returns the tasks for a specific status row.
   * @param status The status of the task row.
   * @returns A list of tasks with the given status.
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
   * Filters tasks based on the search query.
   * @param status The status of the task row.
   * @returns A filtered list of tasks.
   */
  getFilteredTasks(status: string): ITask[] {
    return this.getRowData(status).filter(task =>
      task.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      task.description?.toLocaleLowerCase().includes(this.searchQuery.toLocaleLowerCase())
    );
  }

  /**
   * Returns the display name for a specific status row.
   * @param status The status of the task row.
   * @returns The display name of the task row.
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
   * Returns the number of completed subtasks for a given task.
   * @param task The task whose subtasks are checked.
   * @returns The number of completed subtasks.
   */
  getDoneSubtask(task: ITask) {
    if (!task.subtasks || task.subtasks.length === 0) return 0;
    return task.subtasks.filter(subtask => subtask.subtaskDone).length;
  }

  /**
   * Calculates the progress of a task based on its subtasks.
   * @param task The task whose progress is calculated.
   * @returns The progress in percentage.
   */
  getProgress(task: ITask): number {
    const doneSubtasks = this.getDoneSubtask(task);
    return (doneSubtasks / task.subtasks!.length) * 100;
  }

  /**
   * Checks if the category of a task is "User Story".
   * @param task The task to check.
   * @returns True if the category is "User Story", otherwise false.
   */
  checkCategory(task: ITask) {
    return task.category === "User Story";
  }

  /**
   * Highlights a column during drag & drop.
   * @param columnId The ID of the highlighted column.
   */
  onDragEntered(columnId: string) {
    this.highlightedColumn = columnId;
  }

  /**
   * Removes the highlight from a column when leaving drag & drop.
   */
  onDragExited() {
    this.highlightedColumn = null;
  }

  /**
   * Handles dropping a task into a new column.
   * @param event The drag & drop event.
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
   * Returns the path to an image based on a task's priority.
   * @param task The task whose priority is checked.
   * @param prio The priority to check.
   * @param forceInactive Whether the image should be displayed as inactive.
   * @returns The path to the image.
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
   * Changes the priority of a task.
   * @param task The task whose priority should be changed.
   * @param prio The new priority.
   */
  changePriority(task: ITask, prio: string) {
    task.priority = prio;
  }

  /**
   * Checks if a priority is active.
   * @param task The task whose priority is checked.
   * @param prio The priority to check.
   * @returns True if the priority is active, otherwise false.
   */
  isPriorityActive(task: ITask, prio: string): boolean {
    return task.priority === prio;
  }

  /**
   * Opens the edit dialog for a task.
   * @param id The ID of the task to edit.
   */
  openEditDialog(id: string) {
    this.overlayService.openEditTaskOverlay(id);
  }

  /**
   * Opens the dialog to add a task.
   * @param status The status of the new task (default is "todo").
   */
  openAddTaskDialog(status = "todo") {
    this.overlayService.openAddTaskOverlay(status);
  }
}