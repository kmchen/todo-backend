import { RedisClient } from 'redis'
import { when, mock, instance } from 'ts-mockito'
import TaskManagerRepository from 'services/taskManager/repository'
import taskData from '../fixtures/taskManager/taskManagerResponse.json'

describe('TaskManager Repository', () => {
    it('should have a redis client instance', async () => {
        const mockRedisClient = instance(RedisClient)
        expect(mockRedisClient).not.toBeNull()
    })

    it('should save a task', async () => {
        const redisClient = mock(RedisClient)
        when(redisClient.hset).thenReturn(() => Promise.resolve(JSON.stringify(0)))

        const mockRedisClient = instance(redisClient)
        const repository = new TaskManagerRepository(mockRedisClient)
        const resp = await repository.saveTask('userId', taskData[0])
        expect(resp).toBe('0')
    })

    it('should get a list of task', async () => {
        const redisClient = mock(RedisClient)
        const mockTaskList = {
            '8qF8p52ZTLXeH2LC2L-Km':
                '{"id":"8qF8p52ZTLXeH2LC2L-Km","important":false, "completed":false,"createdAt":1663062811768,"lastEdit":1663062811768,"deleted":false,"text":"string"}',
        }
        when(redisClient.hgetall).thenReturn(() => Promise.resolve(mockTaskList))

        const mockRedisClient = instance(redisClient)
        const repository = new TaskManagerRepository(mockRedisClient)
        const taskList = await repository.getTaskList('userId')
        expect(taskList).toHaveLength(1)
        taskList.forEach((task) => {
            expect(task).toHaveProperty('id')
            expect(task).toHaveProperty('createdAt')
            expect(task).toHaveProperty('lastEdit')
            expect(task).toHaveProperty('deleted')
            expect(task).toHaveProperty('text')
            expect(task).toHaveProperty('completed')
            expect(task).toHaveProperty('important')
        })
    })

    it('should get a task', async () => {
        const redisClient = mock(RedisClient)
        when(redisClient.hget).thenReturn(() => Promise.resolve(JSON.stringify(taskData[0])))

        const mockRedisClient = instance(redisClient)
        const repository = new TaskManagerRepository(mockRedisClient)
        const task = await repository.getTask('userId', 'taskId')
        expect(task).toHaveProperty('id')
        expect(task).toHaveProperty('createdAt')
        expect(task).toHaveProperty('lastEdit')
        expect(task).toHaveProperty('text')
        expect(task).toHaveProperty('completed')
        expect(task).toHaveProperty('important')
    })
})
