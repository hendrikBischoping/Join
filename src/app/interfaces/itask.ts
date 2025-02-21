export interface ISubtask {
    subtaskName: string;
    subtaskDone: boolean;
  }

export interface ITask {
    title: string,
    description?: string,
    contacts?: string[],
    date: string,
    priority: string,
    category: string,
    subtasks?: ISubtask[],
    status: string,
    id: string
}
