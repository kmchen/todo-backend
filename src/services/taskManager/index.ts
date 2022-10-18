import { either, taskEither } from 'fp-ts'
import { pipe } from 'fp-ts/function'

import { TaskNotFoundException, HttpApiException } from 'exceptions'
import TaskManagerRepository from './repository'
import { Task, TaskProperty } from 'types'
class TaskManagerService {
    constructor(private readonly repository: TaskManagerRepository) {}

    async retrieveTasks(user: string): Promise<Task[]> {
        const getTaskList = taskEither.tryCatch<Error, Task[]>(
            async () => await this.repository.getTaskList(user),
            (err) => err as Error
        )

        return await getTaskList().then((e) =>
            pipe(
                e,
                either.fold(
                    (e) => {
                        throw new HttpApiException(500, `retriveTask ${user} failed: ${e}`)
                    },
                    (x) => x
                )
            )
        )
    }
    async deleteTask(user: string, id: string): Promise<void> {
        const getTask = taskEither.tryCatch<Error, Task>(
            async () => {
                const savedTask = await this.repository.getTask(user, id)
                if (!savedTask) {
                    throw new TaskNotFoundException()
                }
                return savedTask
            },
            (err) => err as Error
        )

        await getTask().then((e) =>
            pipe(
                e,
                either.fold(
                    (e) => {
                        if (e instanceof TaskNotFoundException) {
                            throw new HttpApiException(404, `Task ${id} not found: ${e}`)
                        }
                        throw new HttpApiException(500, `getTask failed with id ${id}: ${e}`)
                    },
                    (x) => x
                )
            )
        )

        const removeTask = taskEither.tryCatch<Error, number>(
            async () => await this.repository.removeTask(user, id),
            (err) => err as Error
        )

        await removeTask().then((e) =>
            pipe(
                e,
                either.fold(
                    (e) => {
                        throw new HttpApiException(500, `delete task ${id} failed: ${e}`)
                    },
                    (x) => x
                )
            )
        )
    }

    async updateTask(user: string, id: string, updatedProperties: TaskProperty): Promise<void> {
        const getTask = taskEither.tryCatch<Error, Task>(
            async () => {
                const savedTask = await this.repository.getTask(user, id)
                if (!savedTask) {
                    throw new TaskNotFoundException()
                }
                return savedTask
            },
            (err) => err as Error
        )

        const mergedTask = await getTask().then((e) =>
            pipe(
                e,
                either.fold(
                    (e) => {
                        if (e instanceof TaskNotFoundException) {
                            throw new HttpApiException(404, `Task ${id} not found: ${e}`)
                        }
                        throw new HttpApiException(500, `getTask failed with id ${id}: ${e}`)
                    },
                    (savedTask) => ({ ...savedTask, ...updatedProperties, lastEdit: new Date().getTime() })
                )
            )
        )

        const updateTask = taskEither.tryCatch<Error, number>(
            async () => await this.repository.saveTask(user, mergedTask),
            (err) => err as Error
        )

        await updateTask().then((e) =>
            pipe(
                e,
                either.fold(
                    (e) => {
                        throw new HttpApiException(500, `update task failed with id ${id}: ${e}`)
                    },
                    (x) => x
                )
            )
        )
    }

    async createTask(user: string, task: Task): Promise<void> {
        const saveTask = taskEither.tryCatch<Error, number>(
            async () => await this.repository.saveTask(user, task),
            (err) => err as Error
        )

        await saveTask().then((e) =>
            pipe(
                e,
                either.fold(
                    (e) => {
                        throw new HttpApiException(500, `createTask failed: ${e}`)
                    },
                    (x) => x
                )
            )
        )
    }
}

export default TaskManagerService
