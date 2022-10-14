import { Request, Response } from 'express'
import { taskManagerService } from 'services'
import asyncHandler from 'utils/asyncHandler'
import { nanoid } from 'nanoid'
import { HttpApiException } from 'exceptions'
import { pipe } from 'fp-ts/function'
import { task, either } from 'fp-ts'
import { Either, right, left } from 'fp-ts/Either'

const minLength = (s: string): Either<string, string> => (s.length > 0 ? right(s) : left('at least 1 characters'))
const isBoolean = (value: boolean): Either<string, boolean> => (typeof value == 'boolean' ? right(value) : left('value is not boolean'))

/**
 * @typedef Task
 * @property {string} text.required
 */

/**
 * Create a new task
 * @route POST /task
 * @group Task - Task operations
 * @param {Task.model} text.body.required - the new task
 * @returns {string} 201 - Successfully created a task
 * @returns {Error}  default - Unexpected error
 */
export const newTask = asyncHandler(async (req: Request, res: Response) => {
    const { text } = req.body
    const validText = pipe(
        minLength(text),
        either.fold(
            () => {
                throw new HttpApiException(400, `invalid payload`)
            },
            (text) => text
        )
    )
    const timestamp = new Date().getTime()
    const id = nanoid()
    await taskManagerService.createTask('km', {
        id,
        text: validText,
        createdAt: timestamp,
        lastEdit: timestamp,
        deleted: false,
        completed: false,
        important: false,
    })
    res.end(id as string)
})

/**
 * Get all tasks associated to a user
 * @group Task - Task operations
 * @route GET /task
 * @returns {object} 200 - Successfully get a list of tasks
 * @returns {Error}  default - Unexpected error
 */
export const taskList = asyncHandler(async (req: Request, res: Response) => {
    const taskList = await taskManagerService.retrieveTasks('km')
    res.json(taskList)
})

/**
 * @typedef TaskWithId
 * @property {string} id.required
 * @property {string} text
 * @property {boolean} important
 * @property {boolean} completed
 */

/**
 * UPDATE a task
 * @route PATCH /task/update
 * @group Task - Task operations
 * @param {TaskWithId.model} TaskWithId.body.required - Fields to be updated
 * @returns {object} 200 - Successfully update a task
 * @returns {Error}  default - Unexpected error
 */
export const updateTask = asyncHandler(async (req: Request, res: Response) => {
    const { id, completed, important } = req.body
    const eitherFold = either.fold(
        () => {
            throw new HttpApiException(400, `invalid payload`)
        },
        (value: boolean) => value
    )
    const isImportant = pipe(isBoolean(important), eitherFold)
    const isCompleted = pipe(isBoolean(completed), eitherFold)
    const taskList = await taskManagerService.updateTask('km', id, isCompleted, isImportant)
    res.json(taskList)
})

/**
 * DELETE a task
 * @route DELETE /task/delete/{id}
 * @group Task - Task operations
 * @param {string} id.path.required - taskId
 * @returns {object} 200 - Successfully delete a task
 * @returns {Error}  default - Unexpected error
 */
export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const validId = pipe(
        minLength(id),
        either.fold(
            () => {
                throw new HttpApiException(400, `invalid payload`)
            },
            (id) => id
        )
    )
    await taskManagerService.deleteTask('km', validId)
    res.end()
})
