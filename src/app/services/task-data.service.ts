import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase-service.service';
import { ITask } from '../interfaces/itask';

@Injectable({
  providedIn: 'root'
})
/**
 * Service for managing task data operations with Firestore.
 */
export class TaskDataService {
  /** Name of the Firestore collection for tasks */
  private collectionName = 'Tasks'; 
  
  /**
   * Creates an instance of the TaskDataService.
   * @param firebaseService - The Firebase service for database operations
   */
  constructor(private firebaseService: FirebaseService) {}

  /**
   * Subscribes to all task documents from the database.
   * @returns An Observable containing the list of tasks
   */
  getTasks() {
    return this.firebaseService.task$;
  }

  /**
   * Retrieves a single task document by its ID.
   * @param taskId - The ID of the desired task
   * @returns A Promise containing the task document
   */
  getTaskById(taskId: string) {
    return this.firebaseService.getSingleDoc(this.collectionName, taskId);
  }

  /**
   * Adds a new task to the database.
   * @param task - The task object to be added
   * @returns A Promise that signals the completion of the operation
   */
  async addTask(task: ITask): Promise<void> {
    console.log(task);
    await this.firebaseService.addToDB(this.collectionName, task);
  }

  /**
   * Updates an existing task in the database.
   * @param taskId - The ID of the task to be updated
   * @param updatedData - The new data for the task
   * @returns A Promise with the updated document
   */
  async updateTask(taskId: string, updatedData: Partial<ITask>) {
    return await this.firebaseService.updateDoc(this.collectionName, taskId, updatedData);
  }

  /**
   * Deletes a task from the database.
   * @param taskId - The ID of the task to be deleted
   * @returns A Promise that signals the completion of the deletion
   */
  async deleteTask(taskId: string) {
    return await this.firebaseService.deleteDocument(this.collectionName, taskId);
  }
}
