const User = require("../model/usersModel")
const jwt = require("jsonwebtoken")
const ErrorHandler = require("../middlewares/errorHandler")
const bcrypt = require("bcrypt")

const maxAge = 3 * 24 * 60 * 60
const createToken = id => {
	return jwt.sign({id}, process.env.TOKEN_SECRET, {
		expiresIn: maxAge,
	})
}

exports.register = async (req, res, next) => {
	try {
		const {email} = req.body
		const userCheck = await User.findOne({email})
		if (userCheck) {
			return next(new ErrorHandler("This user already exists", 400))
		}

		const user = await User.create(req.body)

		if (!user) {
			return res.status(400).json({
				success: false,
				msg: "Unable to create user",
				data: null,
			})
		}

		const token = createToken(user._id)

		res.cookie("jwt", token, {
			withCredentials: true,
			httpOnly: false,
			maxAge: maxAge * 1000,
		})

		res.status(201).json(
			{
				user: user._id,
				success: true,
				msg: "Your account has been created. Please await verification.",
			}
		)

	} catch (error) {
		console.log(error)
		res.status(400).json(
			{
				success: false,
				msg: "Unknown error occured" + error
			}
		)
	}
}

exports.login = async (req, res, next) => {
	try {
		const {email, password} = req.body
		if (!email || !password) {
			return next(new ErrorHandler("All fields are mandatory", 400))
		}

		const user = await User.findOne({email}).select("+password")

		if (!user) {
			return next(new ErrorHandler("Incorrect email or password", 400))
		}

		const isPasswordValid = await user.comparePassword(password, user.password)
		if (!isPasswordValid) {
			return res.status(400).json({
				success: false,
				msg: "Username or Password is incorrect",
			})
		}

		if (user.isVerified === false) {
			return next(new ErrorHandler("You are not verified", 404))
		}

		const token = createToken(user._id)

		res.cookie("jwt", token, {httpOnly: false, maxAge: maxAge * 1000})

		res.status(200).json({
			user: user._id,
			success: true,
			msg: "You are logged in",
		})
	} catch (err) {
		res.status(400).json({
			success: false,
			msg: "Unknown error occured",
		})
	}
}

exports.getUserInfo = async (req, res) => {
	try {
		const user = await User.findById(req.user.id)
		user.password = undefined
		if (!user) {
			res.status(404).json({
				success: false,
				msg: "Unable to find user",
			})
		}
		res.status(200).json({
			success: true,
			data: user,
		})
	} catch (error) {
		res.status(400).json({
			success: false,
			msg: error.message,
		})
	}
}

exports.getUsers = async (req, res) => {
	try {
		
		const users = await User.find({role:"user"})
		if (!users) {
			res.status(400).json({
				success: false,
				msg: "Unable to fetch users",
			})
		}

		res.status(200).json({
			success: true,
			msg: "Users fetched successfully",
			data: users,
		})
	} catch (error) {
		res.status(200).json({
			success: true,
			msg: error.message,
			data: null,
		})
	}
}

//update user status i.e verified

exports.updateUserStatus = async (req, res) => {
	try {
		const verified = await User.findByIdAndUpdate(req.body.selectedUser, {
			isVerified: req.body.isVerified,
		})

		res.status(200).send({
			data: null,
			msg: "User status was updated",
			success: true,
		})
	} catch (error) {
		res.status(400).json({
			success: false,
			msg: error.message,
		})
	}
}

exports.changePassword = async (req, res, next) => {
	try {
		const {currentpassword, password, conpassword} = req.body

		const user = await User.findById(req.user.id).select("+password")
		const isCorrectPassword = await bcrypt.compare(
			currentpassword,
			user.password
		)
		if (!isCorrectPassword) {
			return res.status(400).json({
				success: false,
				msg: "The current password you provide is incorrect!",
			})
		}

		const hashedPassword = await bcrypt.hash(password, 10)

		user.password = hashedPassword

		await user.save()

		res.status(200).json({
			success: true,
			msg: "Your Password has been updated",
		})
	} catch (error) {
		res.status(404).json({
			success: false,
			msg: "Internal Server Error",
		})
	}
}

exports.ResetPasswordByEmail = async (req, res, next) => {
	try {
		const {email} = req.body
		const userEmail = await User.findOne({email})
		if (!userEmail) {
			return res.status(400).json({
				success: false,
				msg: "We do not have that email on file",
			})
		}

		res.status(200).json({
			success: true,
			msg: "Email was sent to your email address.",
		})
	} catch (error) {
		res.status(400).json({
			success: false,
			msg: error.message,
		})
	}
}

exports.changePasswordByAdmin = async (req, res) => {
	try {
		const tempPassword = "password1234"
		const hashedPassword = await bcrypt.hash(tempPassword, 10)
		const user = await User.findByIdAndUpdate(req.body.selectedUser, {
			password: hashedPassword,
		})

		res.status(200).send({
			data: null,
			msg: "The user password has been updated",
			success: true,
		})
	} catch (error) {
		res.status(400).json({
			success: false,
			msg: error.message,
		})
	}
}

