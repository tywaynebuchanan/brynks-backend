const ErrorHandler = require("../middlewares/errorHandler")
const Transaction = require("../model/transactions")
const User = require("../model/usersModel")
const mongoose = require("mongoose")

//transfer funds from one account to another

exports.transferTo = async (req, res, next) => {
	try {
		const {sender, amount, receiver} = req.body

		const newTransaction = await Transaction.create(req.body)
		await User.findByIdAndUpdate(sender, {$inc: {balance: -amount}})
		await User.findByIdAndUpdate(receiver, {$inc: {balance: amount}})

		if (newTransaction) {
			res.status(200).json({
				success: true,
				msg: "Transaction successful",
				data: newTransaction,
			})
		} else {
			return next(new ErrorHandler("Transaction Failed", 400))
		}
	} catch (error) {
		console.log(error)
		res.status(500).json({
			success: false,
			msg: error.message,
			error: error.message,
		})
	}
}

exports.verifyUser = async (req, res, next) => {
	try {
		const receiverId = req.body.receiver
		const isValidObjectId = mongoose.Types.ObjectId.isValid(receiverId)

		if (!isValidObjectId) {
			throw new Error("Invalid receiver ID")
		}

		const user = await User.findOne({_id: receiverId})

		if (!user.isVerified) {
			res.status(400).json({
				success: false,
				msg: "Account not found or is not verified",
				verified: user.isVerified,
			})
			return
		}

		if (user.isVerified) {
			res.status(200).json({
				success: true,
				msg: "Account verified",
				data: user,
			})
		}
	} catch (error) {
		console.error(error)
		res.status(500).json({
			success: false,
			msg: "Unable to verify the receiver",
			error: error.message,
		})
	}
}

exports.getAllTransactions = async (req, res, next) => {
	try {
		const userId = req.body.userId
		console.log(userId)
		const tx = await Transaction.find({
			$or: [{sender: userId}, {receiver: userId}],
		})
			.sort({createdAt: -1})
			.populate("sender")
			.populate("receiver")
		res.status(200).json({
			success: true,
			tx,
		})
	} catch (error) {
		res.status(500).json({
			success: false,
			msg: "Internal Server Error",
		})
	}
}
