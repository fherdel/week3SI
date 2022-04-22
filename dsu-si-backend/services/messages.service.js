const Message = require('../schemas/message.schema');

/**
 * get here messages from mongo messages collection
 */
module.exports.getMessagesHistory = async (response) => {
  try {
    const messages = await Message.find();
    return messages;
  } catch(error) {
    console.log('error', error);
    response.status(500).send({ error });
  }
};

/**
 * add here messages to mongo messages collection
 */
module.exports.addToMessageHistory = async ( values ) => {
  try {
    console.log(values);
    let { user, message } = values;
    let { username } = user;
    const value = await Message({username, message}).save();
    return {message: 'success adding a new message'};
  } catch(error) {
    console.log('error', error);
    return error;
  } 
}

/**
 * delete messages from mongo messages collection
 */
module.exports.clearMessages = async ( response ) => {
  try {
    await Message.deleteMany();
    return { message: 'successed deleting messages'};
  } catch(error) {
    console.log('error', error);
    response.status(500).send( { error });
  }
};
