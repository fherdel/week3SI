const Message = require("../schemas/message.schema");

const messages = [];

/**
 * get here messages from mongo messages collection
 */
module.exports.getMessagesHistory = async (req, res) => {
  try {
    // Get all message
    const messages = await Message.find();
    console.log("messages: ", messages);
    return {
      error: false,
      data: messages,
    };
  } catch (error) {
    console.log("error: ", error);
    res.status(500).send({ error });
  }
};

/**
 * add here messages to mongo messages collection
 */
module.exports.addToMessageHistory = async (values) => {
  let { username, message } = values;
  console.log("val", values)
  // Create a new message model
  const newMessage = new Message({
    username,
    message,
  });

  // Save the message in DB
  newMessage.save((err, doc) => {
    if (!err) {
      return {
        error: "",
        data: doc,
      };
    } else {
      return {
        error: err,
      };
    }
  });
};

/**
 * delete messages from mongo messages collection
 */
module.exports.clearMessages = async () => {
  try {
    await Message.deleteMany();
    return {
      error: "",
      data: [],
    };
  } catch (error) {
    return {
      error,
    };
  }
};
