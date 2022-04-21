//const messages = [{username:"mock", message:"data"}];
const Messages=require("../schemas/message.schema")
/**
 * get here messages from mongo messages collection
 */
module.exports.getMessagesHistory = async () => {
	try {
    const m = await Messages.find()
    console.log('messages: ', m);

    return m ? m : [{username:"mock", message:"data"}]
  } catch (error) {
    console.log('error: ', error);
    return [];
  }
}
//const getMessagesHistory = () => messages;

/**
 * add here messages to mongo messages collection
 */
//const addToMessageHistory = ( username, message ) =>
  //messages.push( {username, message} );
module.exports.addToMessageHistory = async (username, message)=>{
    console.log('values: ', username, message);
    const newMessage = new Messages({
      username,
	    message,
    })
    const result = await newMessage.save();
    return result
}
/**
 * delete messages from mongo messages collection
 */
//const clearMessages = () => (messages.length = 0);
module.exports.clearMessages = async ()=>{
  await Messages.collection.drop();
  return [];
}
//module.exports = { getMessagesHistory, addToMessageHistory, clearMessages };
