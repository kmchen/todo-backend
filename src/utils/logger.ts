import { appConfig } from 'config/appConfig'
import pino from 'pino'

const logger = pino({
    level: appConfig.LOG_LEVEL || 'info',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'hostname,pid',
        },
    },
})

export default logger
