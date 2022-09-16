import { Application } from 'express'

const initializeSwagger = (basePath: string, basedir: string, app: Application) => {
    // eslint-disable-next-line global-require
    const expressSwagger = require('express-swagger-generator')(app)

    const options = {
        swaggerDefinition: {
            info: {
                description: 'TODO List Backend app',
                title: 'TODO list API',
                version: '1.0.0',
            },
            basePath,
            produces: ['application/json'],
            schemes: ['http'],
        },
        basedir,
        files: ['./controllers/**/*.ts', './controllers/**/*.js'],
    }

    expressSwagger(options)
}

export default initializeSwagger
