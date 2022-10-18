import TaskManagerRepository from 'services/taskManager/repository'
import TaskManagerService from 'services/taskManager'
import { mock } from 'ts-mockito'
import taskData from '../fixtures/taskManager/taskManagerResponse.json'

describe('TaskManager service', () => {
    it('should throw when failing to get task list', async () => {
        const mockedForecastRepository = mock(TaskManagerRepository)
        mockedForecastRepository.getTaskList = () => {
            throw new Error('failed to get tasks')
        }
        const service = new TaskManagerService(mockedForecastRepository)
        await expect(async () => {
            await service.retrieveTasks('userId')
        }).rejects.toThrow()
    })

    it('should get task list', async () => {
        const mockedForecastRepository = mock(TaskManagerRepository)
        mockedForecastRepository.getTaskList = () => Promise.resolve(taskData)
        const service = new TaskManagerService(mockedForecastRepository)
        const taskList = await service.retrieveTasks('userId')
        expect(taskList).toHaveLength(2)
        taskList.forEach((task) => {
            expect(task).toHaveProperty('id')
            expect(task).toHaveProperty('createdAt')
            expect(task).toHaveProperty('lastEdit')
            expect(task).toHaveProperty('text')
            expect(task).toHaveProperty('important')
            expect(task).toHaveProperty('completed')
        })
    })

    it('should throw when id is not found for the deleted task', async () => {
        const mockedForecastRepository = mock(TaskManagerRepository)
        mockedForecastRepository.getTask = () => {
            throw new Error('failed to remove a task')
        }
        const service = new TaskManagerService(mockedForecastRepository)
        await expect(async () => {
            await service.deleteTask('userId', 'someId')
        }).rejects.toThrow()
    })

    it('should throw when failing to delete task', async () => {
        const mockedForecastRepository = mock(TaskManagerRepository)
        mockedForecastRepository.getTask = () => Promise.resolve(taskData[0])
        mockedForecastRepository.removeTask = () => {
            throw new Error('failed to remove a task')
        }
        const service = new TaskManagerService(mockedForecastRepository)
        await expect(async () => {
            await service.deleteTask('userId', 'someId')
        }).rejects.toThrow()
    })

    it('should delete a task', async () => {
        const mockedForecastRepository = mock(TaskManagerRepository)
        mockedForecastRepository.getTask = () => Promise.resolve(taskData[0])
        mockedForecastRepository.saveTask = () => Promise.resolve(0)
        const service = new TaskManagerService(mockedForecastRepository)
        const resp = await service.deleteTask('userId', 'someId')
        expect(resp).toBeUndefined()
    })

    it('should throw when failing to update a task', async () => {
        const mockedForecastRepository = mock(TaskManagerRepository)
        mockedForecastRepository.saveTask = () => {
            throw new Error('failed to save a task')
        }
        const service = new TaskManagerService(mockedForecastRepository)
        await expect(async () => {
            await service.updateTask('userId', 'someId', { completed: true, important: true })
        }).rejects.toThrow()
    })

    it('should update a task', async () => {
        const mockedForecastRepository = mock(TaskManagerRepository)
        mockedForecastRepository.getTask = () => Promise.resolve(taskData[0])
        mockedForecastRepository.saveTask = () => Promise.resolve(0)
        const service = new TaskManagerService(mockedForecastRepository)
        const resp = await service.updateTask('userId', 'someId', { completed: true, important: true })
        expect(resp).toBeUndefined()
    })

    it('should throw when failing to create a task', async () => {
        const mockedForecastRepository = mock(TaskManagerRepository)
        mockedForecastRepository.saveTask = () => {
            throw new Error('failed to a save task')
        }
        const service = new TaskManagerService(mockedForecastRepository)
        await expect(async () => {
            await service.createTask('userId', taskData[0])
        }).rejects.toThrow()
    })

    it('should create a task', async () => {
        const mockedForecastRepository = mock(TaskManagerRepository)
        mockedForecastRepository.saveTask = () => Promise.resolve(1)
        const service = new TaskManagerService(mockedForecastRepository)
        const resp = await service.createTask('userId', taskData[0])
        expect(resp).toBeUndefined()
    })
})
