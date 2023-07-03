const mongoose = require("mongoose")

const RequestSchema = new mongoose.Schema({

     sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        
    },
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        
    },
    amount:{
        type: Number,
        required:[true,"The amount for the request is required"]
    },
     description:{
        type: String,
        required: [true, "A descripton of the transaction is required"]
    },
    status: {
        type: String,
        default: "Pending"

    }


},{timestamps:true})

const Request = mongoose.model("requests",RequestSchema)

module.exports = Request