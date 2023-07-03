const mongoose = require("mongoose")

const TransactionSchema = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true,"You need a sender for this transaction"]
    },
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true,"You need a receiver for this transaction"]
    },
    amount: {
        type: Number,
        required: [true, "An amount is required"]
    },
    description:{
        type: String,
        required: [true, "A descripton of the transaction is required"]
    },
    status: {
        type: String,
        required: [true, "The status for the transaction is required"]
    },
},{timestamps: true})

const Transaction = mongoose.model("transactions",TransactionSchema)
module.exports = Transaction