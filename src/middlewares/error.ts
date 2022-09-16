import { NextFunction, Request, Response } from 'express'
import { HttpApiException } from '../exceptions'

const errorMiddleware = (err: HttpApiException, req: Request, res: Response, next: NextFunction) => {
    const status = err.statusCode || 500
    const message = err.message || 'Something went wrong'

    res.status(status).send({
        message,
        status,
    })
}

export default errorMiddleware
