
class ApiError extends Error{

    constructor(
        statusCode = 400,
        message = "Something went wrong",
        errors = [],
        stack = ""
    )
    {

        this.statusCode = statusCode
        this.message = message
        this.errors = errors
        this.success = false
        this.data = null

        if(stack){
            this.stack = stack
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}


export { ApiError }