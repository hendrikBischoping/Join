import { Component } from '@angular/core';
import { FirebaseService } from '../../services/firebase-service.service';
import { TaskDataService } from '../../services/task-data.service';
import { ITask } from '../../interfaces/itask';
import { CommonModule } from '@angular/common';
import { RouterModule} from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})

/**
 * Represents a component that displays a summary of tasks for the current user.
 */
export class SummaryComponent {
  isGuest = false;
  currentUser = "";
  tasks: ITask[] = [];
  upcomingTask!: ITask;

  /**
   * Constructor to initialize the SummaryComponent.
   * @param firebaseService - The Firebase service for data interaction.
   * @param taskDataService - The service for task data management.
   * @param authService - The authentication service to get user information.
   */
  constructor(public firebaseService: FirebaseService, private taskDataService: TaskDataService, private authService: AuthService) {
    if (authService.getUserName() && authService.getUserName() != "Guest") {
      this.currentUser = authService.getUserName();
    }
  }

  /**
   * Lifecycle Hook: Called on component initialization.
   * Subscribes to the task list and prepares it for display.
   */
  ngOnInit() {
    this.taskDataService.getTasks().subscribe((taskList) => {
      this.tasks = taskList.map(task => ({
        ...task,
        parsedDate: this.parseDate(task.date) ?? null,
      }));
      this.findUpcomingTask();
    });
  }

  /**
   * Converts a date string into a Date object.
   * Supports various date formats.
   * @param dateString - The date string to parse.
   * @returns A Date object or null if the string is invalid.
   */
  parseDate(dateString: string): Date | null {
    if (!dateString) return null;
    if (dateString.includes("-")) {
      return new Date(dateString);
    } else if (dateString.includes(".")) {
      const parts = dateString.split(".").map(Number);
      return new Date(parts[2], parts[1] - 1, parts[0]); 
    }
    return null;
  }

  /**
   * Finds the next upcoming task based on the current date.
   * Sets the 'upcomingTask' property to the nearest task.
   */
  findUpcomingTask() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.upcomingTask = this.tasks
      .filter(task => task.parsedDate && task.parsedDate >= today && task.status !== "done")
      .sort((a, b) => a.parsedDate!.getTime() - b.parsedDate!.getTime())[0];
  }

  /**
   * Returns a greeting message based on the current time.
   * @returns A greeting message as a string.
   */
  getWelcomeMessage(): string {
    const currentDate = new Date().getHours();
    if (currentDate < 12) {
      return "Good morning";
    } else if (currentDate < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  }

  /**
   * Returns the date of the next upcoming task.
   * @returns The date as a formatted string or a message if no task is available.
   */
  getDateOfUpcomingTask(): string {
    if (!this.upcomingTask || !this.upcomingTask.parsedDate) {
      return "No upcoming tasks";
    }
  
    return this.upcomingTask.parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  /**
   * Returns the priority of the next upcoming task.
   * @returns The priority of the task or a message if no task is available.
   */
  getUpcomingTaskPrio(): string {
    if (!this.upcomingTask) { return "No upcoming tasks"; }
    return this.upcomingTask.priority;
  }

  /**
   * Returns the CSS class based on the priority of the next upcoming task.
   * @returns A CSS class as a string.
   */
  getUpcomingTaskPrioClass(): string {
    return `bg-${this.getUpcomingTaskPrio().toLocaleLowerCase()}`;
  }

  /**
   * Returns the path to the icon for the priority of the next upcoming task.
   * @returns The path to the icon as a string.
   */
  getUpcomingTaskPrioIcon(): string {
    return `./assets/img/add-task/${this.getUpcomingTaskPrio().toLowerCase()}-active.png`;
  }
}
