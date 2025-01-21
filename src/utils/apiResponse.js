class ApiResponse{

    constructor(
        statusCode = 200,
        data,
        message
    ){

        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = true
    }
}

export { ApiResponse }