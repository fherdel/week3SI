// const messages = [{username:"mock", message:"data"}];
const model_messages = require('../schemas/message.schema');

/**
 * get here messages from mongo messages collection
 */
const getMessagesHistory = async () => {
	try {
		const alll_messages = await model_messages.find();
		return alll_messages.length !== 0
			? alll_messages
			: [ { username: 'example user', message: 'example message' } ];
	} catch (error) {
		return [];
	}
};

/**
 * add here messages to mongo messages collection
 */
const addToMessageHistory = async (username, message) => {
	try {
		const tempo = new model_messages({
			username,
			message
		});
		return await tempo.save();
	} catch (error) {
		console.error(error);
		return [];
	}
};

/**
 * delete messages from mongo messages collection
 */
const clearMessages = async () => {
	try {
		await model_messages.collection.drop();
		return [];
	} catch (error) {
		console.error(error);
		return [];
	}
};

module.exports = { getMessagesHistory, addToMessageHistory, clearMessages };
