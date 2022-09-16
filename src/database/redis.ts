import { appConfig } from 'config/appConfig'
import { createNodeRedisClient } from 'handy-redis'

const client = createNodeRedisClient({
    host: appConfig.REDIS_HOST,
    port: parseInt(appConfig.REDIS_PORT || '6379', 10),
    prefix: appConfig.REDIS_PREFIX,
})

export default client
