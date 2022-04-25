const mongoose = require("mongoose")

const User = mongoose.Schema({
	token: String,
	username: String,
	password: String,
})

module.exports = mongoose.model("User", User)