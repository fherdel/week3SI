//add here messages schema
const mongoose = require("mongoose")

const Messages = mongoose.Schema({
	username: String,
	message: String,
})

module.exports = mongoose.model("Messages", Messages)