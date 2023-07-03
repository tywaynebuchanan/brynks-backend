const mongoose = require("mongoose")
require("dotenv").config()
const DBURI = process.env.DATABASE.replace("<PASSWORD>", process.env.DBPASSWORD)

mongoose.connect(DBURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

const DB = mongoose.connection
module.exports = DB
