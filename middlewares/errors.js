const ErrorHandler = require("../middlewares/errorHandler")

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal Server Error"


    if(process.env.NODE_ENV === "DEVELOPMENT"){
        res.status(err.statusCode).json({
        success: false,
        error: err,
        errMessage: err.message,
        stack: err.stack
    })
    }
    
    if(process.env.NODE_ENV === "PRODUCTION"){
        // let message;
        let error = {...err}

        error.message = err.message

        //Wrong Mongoose ID Object 
        if(err.name === 'CastError'){
            const message = `Resource not found. Invalid ${path}`
            error = new ErrorHandler(message,400)
        }

        //Handling Mongoose Validation Error

        if(err.name === 'ValidationError'){
            const message = Object.values(err.errors).map(value=>value.message)
            error = new ErrorHandler(message,400)

        }

        if(err.name === 'MongoServerSelectionError'){
            const message = 'Unable to connect to the server',
            error = new ErrorHandler(message, 500)
        }

        res.status(err.statusCode).json({
        success: false,
        msg: error.message || "Internal Server Error"
    })
    }
    
}