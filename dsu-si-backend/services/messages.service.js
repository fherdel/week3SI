const HistoryText=require("../schemas/message.schema")
var messages = [{username:"Admin", message:"Sin mensajes aun"}];

/**
 * get here messages from mongo messages collection
 */
const getMessagesHistory = async () => {
  if (messages.length<1) {
    try {
      const history = await HistoryText.find()
        return history
    }
    catch (error) {
        console.log('error: ', error);
        return messages
    }    
  } else {
    return messages
  }
};

/**
 * add here messages to mongo messages collection
 */
const addToMessageHistory = async ( username, message ) =>{
  try {
    const history = await HistoryText({username, message}).save()
  }
  catch (error) {
      console.log('error: ', error);
  }
  messages.push({username, message} ) 
};

/**
 * delete messages from mongo messages collection
 */
const clearMessages = async () => {
  messages.length = 0
  messages=[{username:"Admin", message:"Sin mensajes aun"}];
  const result=await HistoryText.deleteMany()
  console.log (result)
};

module.exports = { getMessagesHistory, addToMessageHistory, clearMessages };
