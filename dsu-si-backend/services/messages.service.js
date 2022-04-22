
const messagesModel = require('../schemas/message.schema') 
/**
 * get here messages from mongo messages collection
 */
const getMessagesHistory = async() => {
  const messages = await messagesModel.find();
  console.log(messages)
  return messages 
}
/**
 * add here messages to mongo messages collection
 */
const addToMessageHistory = ( username, message ) =>{
  const newMessage = new messagesModel({username, message})
  newMessage.save();
}
/**
 * delete messages from mongo messages collection
 */
const clearMessages = async() => {
  await messagesModel.deleteMany({})
};

module.exports = { getMessagesHistory, addToMessageHistory, clearMessages };
