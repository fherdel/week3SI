//add here messages schema
const mongoose = require("mongoose");

const Message = mongoose.Schema({
  username: String,
  message: String,
  date: {
    type: Date,
    default: Date.now(),
    required: true,
  },
});

module.exports = mongoose.model("Message", Message);
