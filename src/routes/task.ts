import express from 'express'
import { newTask, taskList, deleteTask, updateTask } from 'controllers/taskManager'

const router = express.Router()

router.post('/', newTask)

router.get('/', taskList)

router.patch('/update', updateTask)

router.delete('/delete/:id', deleteTask)

export default {
    path: '/task',
    router,
}
