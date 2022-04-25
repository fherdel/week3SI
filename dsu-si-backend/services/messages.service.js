
const messagesModel = require('../schemas/message.schema') 
// const {verifyToken} = require('./token-verify')
/**
 * get here messages from mongo messages collection
 */
const getMessagesHistory = async() => {
  try {

      const messages = await messagesModel.find();
      // console.log(messages)
      return messages 
  } catch (error) {
    throw Error(error)
  }
}
/**
 * add here messages to mongo messages collection
 */
const addToMessageHistory = async( username, message ) =>{
  try {
    if (username !== "" && message !== "") {
      const newMessage = new messagesModel({username, message})
      newMessage.save();
      const verifyMSG = messagesModel.findOne({username, message})
      return verifyMSG;
      
    }else{
      throw Error('missing params')
    }

  } catch (error) {
    console.log(error)
    throw Error(error)
  }
}
/**
 * delete messages from mongo messages collection
 */
const clearMessages = async(username) => {
  try {
    if (username !== "") {
      await messagesModel.deleteMany({})
    }else{
      throw Error("Missing token")
    }
  } catch (error) {
    throw Error(error)
  }
};

module.exports = { getMessagesHistory, addToMessageHistory, clearMessages };
