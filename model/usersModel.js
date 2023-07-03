const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const validator = require("validator")

const UserSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, "A first name is required"],
			trim: true,
			min: 3,
		},
		lastName: {
			type: String,
			required: [true, "A last name is required"],
			trim: true,
			min: 3,
		},
		email: {
			type: String,
			required: [true, "An email is required"],
			unique: true,
			trim: true,
			validate: [validator.isEmail, "The email is invalid"],
		},
		cellPhone: {
			type: String,
			required: [true, "A phone number is required"],
		},
		idType: {
			type: String,
			required: [true, "An Id is required"],
		},
		idNumber: {
			type: String,
			required: [true, "An Id number is required"],
		},
		address: {
			type: String,
			min: 3,
			max: 250,
		},
		address2: {
			type: String,
			min: 3,
			max: 250,
		},

		city: {
			type: String,
			min: 3,
			max: 250,
		},
		parish: {
			type: String,
			min: 3,
			max: 250,
		},
		password: {
			type: String,
			required: [true, "A password is required"],
		},

		isVerified: {
			type: Boolean,
			default: false,
		},
		role: {
			type: String,
			default: "user",
		},
		balance: {
			type: Number,
			default: 0,
		},
		resetPasswordToken: String,
		resetPasswordExpires: Date,
	},
	{timestamps: true}
)

UserSchema.pre("save", async function (next) {
	const salt = await bcrypt.genSalt()
	this.password = await bcrypt.hash(this.password, salt)
	next()
})

UserSchema.methods.comparePassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model("users", UserSchema)
