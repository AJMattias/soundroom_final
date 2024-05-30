export class ApiException extends Error {
    
    constructor(status, error, errorCode, message, extras) {
        super(message)
        this.statusCode = status
        this.error = error
        this.errorCode = errorCode
        this.message = message
        this.arguments = extras
    }
}