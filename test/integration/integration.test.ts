import { Wait, DockerComposeEnvironment, DownedDockerComposeEnvironment } from 'testcontainers'
const request = require('request')
const util = require('util')

const requestPromise = util.promisify(request)

describe('Simple integration test', () => {
    it('should create  task', async () => {
        const response = await requestPromise({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/task',
            body: { text: 'string' },
            json: true,
        })
        expect(response.statusCode).toBe(201)
        expect(response.body.length).toBeGreaterThan(3)
    })

    it('should get task list', async () => {
        const response = await requestPromise({
            method: 'GET',
            url: 'http://localhost:3000/api/v1/task',
            json: true,
        })

        expect(response.statusCode).toBe(200)

        if (response.body.length > 1) {
            response.body.forEach((task: any) => {
                expect(task).toHaveProperty('id')
                expect(task).toHaveProperty('createdAt')
                expect(task).toHaveProperty('lastEdit')
                expect(task).toHaveProperty('deleted')
                expect(task).toHaveProperty('text')
                expect(task).toHaveProperty('important')
                expect(task).toHaveProperty('completed')
            })
        }
    })

    it('should update a task', async () => {
        const getResponse = await requestPromise({
            method: 'GET',
            url: 'http://localhost:3000/api/v1/task',
            json: true,
        })
        expect(getResponse.statusCode).toBe(200)
        const task = getResponse.body[0]

        const patchResponse = await requestPromise({
            method: 'PATCH',
            url: 'http://localhost:3000/api/v1/task/update',
            body: {
                id: task.id,
                important: true,
                completed: true,
            },
            json: true,
        })
        expect(patchResponse.statusCode).toBe(200)
    })

    it('should throw 400 when update a task with invalid payload', async () => {
        const getResponse = await requestPromise({
            method: 'GET',
            url: 'http://localhost:3000/api/v1/task',
            json: true,
        })
        expect(getResponse.statusCode).toBe(200)
        const task = getResponse.body[0]

        const patchResponse = await requestPromise({
            method: 'PATCH',
            url: 'http://localhost:3000/api/v1/task/update',
            body: {
                id: task.id,
                completed: 'true',
            },
            json: true,
        })
        expect(patchResponse.statusCode).toBe(400)
    })

    it('should throw 403 when update a task with invalid id', async () => {
        const patchResponse = await requestPromise({
            method: 'PATCH',
            url: 'http://localhost:3000/api/v1/task/update',
            body: {
                id: 'id',
            },
            json: true,
        })
        console.log(patchResponse.statusCode)
        expect(patchResponse.statusCode).toBe(403)
    })
})
