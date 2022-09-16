import redisClient from 'database/redis'

import TaskManagerService from 'services/taskManager'
import TaskManagerRepository from 'services/taskManager/repository'

export const taskManagerRepository = new TaskManagerRepository(redisClient)
export const taskManagerService = new TaskManagerService(taskManagerRepository)
