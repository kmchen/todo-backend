export interface IAppConfig {
    LOG_LEVEL: string | undefined
    REDIS_HOST: string | undefined
    REDIS_PORT: string | undefined
    REDIS_PREFIX: string | undefined
    REDIS_TTL: string | undefined
    REDIS_DELIMITER: string | undefined
    RETRY_INTERVAL: string | undefined
}

export const appConfig: IAppConfig = {
    LOG_LEVEL: process.env.LOG_LEVEL,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_PREFIX: process.env.REDIS_PREFIX,
    REDIS_TTL: process.env.REDIS_TTL,
    REDIS_DELIMITER: process.env.REDIS_DELIMITER,
    RETRY_INTERVAL: process.env.RETRY_INTERVAL,
}
