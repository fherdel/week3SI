const Message = require("../schemas/message.schema");
const User = require("../schemas/user.schema");
const jwt = require("jsonwebtoken");
/**
 * get here messages from mongo messages collection
 */
const getMessagesHistory = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

 

  try {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      req.user = user;
    });
    const messages = await Message.find();
    return res.status(200).send(messages);
  } catch (e) {
    return res.send("Error");
  }
};

/**
 * add here messages to mongo messages collection
 */
const addToMessageHistory = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
  });

  try {
    const user = await User.findOne({ _id: req.user.id });
    const message = new Message({
      username: user.username,
      message: req.body.message,
    });
    await message.save();
    return res.send(message);
  } catch (e) {
    return res.send("Error");
  }
};

/**
 * delete messages from mongo messages collection
 */
const clearMessages = async (req, res) => {
  try {
    await Message.deleteMany();
    return res.send("Messages deleted");
  } catch (e) {
    return res.send("Error");
  }
};

module.exports = { getMessagesHistory, addToMessageHistory, clearMessages };
