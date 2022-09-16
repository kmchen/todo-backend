import express, { Express } from 'express'
import errorMiddleware from 'middlewares/error'
import loggerMiddleware from 'middlewares/logger'
import { processRoutePath } from 'utils/loader'
import initializeSwagger from 'utils/swagger'

const app: Express = express()

const BASE_PATH = '/api/v1'
const ROUTE_PATH = `${__dirname}/routes`

const initialize = async () => {
    app.use(express.json())
    app.use(loggerMiddleware)
    await processRoutePath(BASE_PATH, ROUTE_PATH, app)
    app.use(errorMiddleware)

    initializeSwagger(BASE_PATH, __dirname, app)
}

initialize()

export default app
