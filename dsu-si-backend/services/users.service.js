const model_user = require('../schemas/user.schema');

// Get all users
module.exports.getUsers = async (req, res) => {
	try {
		const users = await model_user.find();
		console.log('users: ', users);
		return users;
	} catch (error) {
		console.log('error: ', error);
		res.status(500).send({ valid: false });
	}
};

/**
 * add here post for users
 */
module.exports.createUser = async (username, password) => {
	try {
		const tempo = new model_user({
			username,
			password
		});

		return await tempo.save();
	} catch (error) {
		console.error(error);
		return [];
	}
};

// Get single user
module.exports.getSingleUser = async (username, password) => {
	try {
		const pre = model_user.findOne({ username, password });
		return pre;
	} catch (error) {
		console.error(error);
		return null;
	}
};
