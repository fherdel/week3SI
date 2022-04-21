const mongoose = require("mongoose")

const HistoryText = mongoose.Schema({
	username: String,
	message: String,
})

module.exports = mongoose.model("HistoryText", HistoryText)