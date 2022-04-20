const Message = require("../schemas/message.schema")
/**
 * get here messages from mongo messages collection
 */
const getMessagesHistory = async(req, res) => {
  try{
    const messages = await Message.find();
    return res.status(200).send(messages);
  }catch(e){
   return  res.status(500).send({ valid: false });
  }
}

/**
 * add here messages to mongo messages collection
 */
const addToMessageHistory = async(req, res) => {
  try{
    const message = new Message({username: req.body.username, message:req.body.message})
    await message.save()
  return res.send(message)
  }catch(e){
    return res.status(500).send({ valid: false });
  }
}

/**
 * delete messages from mongo messages collection
 */
const clearMessages = async(req, res) => {
  try{
    await Message.deleteMany()
		return res.send("Messages deleted")
  }catch(e){
  return  res.status(500).send({ valid: false });
  }
}


module.exports = { getMessagesHistory, addToMessageHistory, clearMessages };
