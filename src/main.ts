import 'dotenv/config'
import logger from 'utils/logger'
import app from './app'

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
    logger.info(`running on http://localhost:${PORT}`)
})

export default server
