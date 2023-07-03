const Request = require("../model/requests")
const User = require("../model/usersModel")
const Transaction = require("../model/transactions")
const ErrorHandler = require("../middlewares/errorHandler")

exports.getAllRequests = async (req, res, next) => {
	try {
		const requests = await Request.find(req.body.userId)
			.sort({createdAt: -1})
			.populate("sender", "firstName lastName")
			.populate("receiver", "firstName lastName")

		res.send({
			success: true,
			data: requests,
		})
	} catch (error) {
		res.status(400).json({
			sucesss: false,
			msg: error.message,
		})
	}
}

//send a request to other user
exports.SendRequests = async (req, res, next) => {
	try {
		const {receiver, amount, description} = req.body
		const sender = req.body.sender
		const request = await Request.create({
			sender,
			receiver,
			amount,
			description,
		})
		res.status(200).json({
			success: true,
			msg: "Request Successfully Sent!",
			data: request,
		})
	} catch (error) {
		res.status(400).json({
			sucesss: false,
			msg: error.message,
		})
	}
}

//update request status

exports.UpdateStatus = async (req, res, next) => {
	try {
		const sender = req.body.sender._id
		const receiver = req.body.receiver._id
		const {amount, description} = req.body
		if (req.body.status === "Accepted") {
			//create a transaction

			const transaction = new Transaction({
				sender,
				receiver,
				amount,
				description,
				status: "Success",
			})

			await transaction.save()
			//update the amount from the sender's balance
			await User.findByIdAndUpdate(sender, {
				$inc: {balance: amount},
			})

			//add the amount to the receiver's balance
			await User.findByIdAndUpdate(receiver, {
				$inc: {balance: -amount},
			})
		}

		//update the request status
		await Request.findByIdAndUpdate(req.body._id, {
			status: req.body.status,
		})

		res.status(200).send({
			data: null,
			msg: "Request status updated successful",
			success: true,
		})
	} catch (error) {
		res.status(400).json({
			sucesss: false,
			msg: error.message,
		})
	}
}

