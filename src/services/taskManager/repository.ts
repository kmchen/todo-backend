import { WrappedNodeRedisClient } from 'handy-redis'
import { Task } from './types'

class TaskManagerRepository {
    constructor(private readonly client: WrappedNodeRedisClient) {}

    saveTask = async (user: string, task: Task): Promise<number> => {
        return await this.client.hset(user, [task.id, JSON.stringify(task)])
    }

    getTaskList = async (user: string): Promise<Task[]> => {
        const tasks: Record<string, string> = await this.client.hgetall(user)
        if (!tasks) return []
        let parsedTaks: Task[] = []
        for (const [_, value] of Object.entries(tasks)) {
            parsedTaks.push(JSON.parse(value))
        }
        return parsedTaks
    }

    getTask = async (user: string, taskId: string): Promise<Task> => {
        const task = await this.client.hget(user, taskId)
        if (!task) return null
        return JSON.parse(task) as Task
    }

    removeTask = async (user: string, taskId: string): Promise<number> => {
        const numOfDeletedItem = await this.client.hdel(user, taskId)
        return numOfDeletedItem
    }
}

export default TaskManagerRepository
