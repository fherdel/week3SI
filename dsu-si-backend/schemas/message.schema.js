//add here messages schema
const mongoose = require('mongoose');

const Message = mongoose.Schema({
	username: String,
	message: String
});

module.exports = mongoose.model('Messages', Message);
