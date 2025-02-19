export interface ITask {
    title: string,
    description?: string,
    contacts: string[],
    date: number,
    priority: string,
    category?: string,
    subtasks: string[],
    status: string,
    id: string
}
