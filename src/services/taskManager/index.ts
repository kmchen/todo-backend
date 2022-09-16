import { TaskNotFoundException, HttpApiException } from 'exceptions'
import TaskManagerRepository from './repository'
import { Task } from './types'

class TaskManagerService {
    constructor(private readonly repository: TaskManagerRepository) {}

    async retrieveTasks(user: string): Promise<Task[]> {
        try {
            return await this.repository.getTaskList(user)
        } catch (e) {
            throw new HttpApiException(500, `retriveTask ${user} failed: ${e}`)
        }
    }
    async deleteTask(user: string, id: string): Promise<void> {
        try {
            const task = await this.repository.getTask(user, id)
            if (!task) {
                throw new TaskNotFoundException()
            }
            await this.repository.removeTask(user, id)
        } catch (e) {
            if (e instanceof TaskNotFoundException) {
                throw new HttpApiException(404, `Task ${id} not found: ${e}`)
            }
            throw new HttpApiException(500, `deleteTask ${id} failed: ${e}`)
        }
    }

    async updateTask(user: string, id: string, completed: boolean, important: boolean): Promise<void> {
        try {
            const savedTask = await this.repository.getTask(user, id)
            if (!savedTask) {
                throw new TaskNotFoundException()
            }
            const mergedTask = {
                ...savedTask,
                completed,
                important,
                lastEdit: new Date().getTime(),
            }
            await this.repository.saveTask(user, mergedTask)
        } catch (e) {
            if (e instanceof TaskNotFoundException) {
                throw new HttpApiException(404, `Task ${id} not found: ${e}`)
            }
            throw new HttpApiException(500, `updateTask ${id} failed: ${e}`)
        }
    }

    async createTask(user: string, task: Task): Promise<void> {
        try {
            const numOfSavedTask = await this.repository.saveTask(user, task)
            if (!numOfSavedTask) throw new HttpApiException(500, `createTask failed:`)
        } catch (e) {
            throw new HttpApiException(500, `createTask failed: ${e}`)
        }
    }
}

export default TaskManagerService
