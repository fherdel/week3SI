const messages = [{username:"mock", message:"data"}];

/**
 * get here messages from mongo messages collection
 */
const getMessagesHistory = () => messages;

/**
 * add here messages to mongo messages collection
 */
const addToMessageHistory = ( username, message ) =>
  messages.push( {username, message} );

/**
 * delete messages from mongo messages collection
 */
const clearMessages = () => (messages.length = 0);

module.exports = { getMessagesHistory, addToMessageHistory, clearMessages };
