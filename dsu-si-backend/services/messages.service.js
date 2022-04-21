const messages = [{username:"mock", message:"data"}];
const Message = require('../schemas/message.schema')



/**
 * get here messages from mongo messages collection
 */
const getMessagesHistory = async () => {
  try {
    const messages = await Message.find()
    return {message:null,data:messages}
  
  } catch (error) {
    console.error(error)
    return {message:error,data:null}
  }
   
};

/**
 * add here messages to mongo messages collection
 */
const addToMessageHistory = ( username, message ) => {
  try {
    const createMessage = {
      username:username,
      message:message
    }
    Message(createMessage).save()
  } catch (error) {
    console.error(error)
  }
 
}
  

/**
 * delete messages from mongo messages collection
 */
const clearMessages = () => {
  try {
    Message.deleteMany()  
  } catch (error) {
    console.error(error)
  }
};

module.exports = { getMessagesHistory, addToMessageHistory, clearMessages };
