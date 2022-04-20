
const User=require("../schemas/user.schema")

// Get all users
module.exports.getUsers = async (req, res) => {
	try {
        const users = await User.find()
        	console.log('users: ', users);
        	return users
    }
    catch (error) {
        console.log('error: ', error);
        res.status(500).send({valid:false})
    }
}

/**
 * add here post for users
 */
 module.exports.createUser = async (values)=>{
    console.log('values: ', values);
    return ":( no logic added yet"
}