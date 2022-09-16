export class ResultNotFoundException extends Error {}

export class TaskNotFoundException extends Error {}

export class HttpApiException extends Error {
    public statusCode: number

    public message: string

    constructor(statusCode: number, message: string) {
        super(message)
        this.statusCode = statusCode
        this.message = message
    }
}
