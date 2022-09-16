import { Request, Response } from 'express'
import { taskManagerService } from 'services'
import asyncHandler from 'utils/asyncHandler'
import { nanoid } from 'nanoid'

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
    const timestamp = new Date().getTime()
    const id = nanoid()
    await taskManagerService.createTask('km', {
        id,
        text,
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
    const { id, text, completed, important } = req.body
    const lastEdit = new Date().getTime()
    const taskList = await taskManagerService.updateTask('km', id, completed, important)
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
    await taskManagerService.deleteTask('km', id)
    res.end()
})
