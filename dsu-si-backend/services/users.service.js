
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
module.exports.createUser = async (username,password)=>{
    console.log('values: ', username,password);
    const newUser = new User({
        username,
	    password,
    })
    const result = await newUser.save();
    return result
}

module.exports.getUser = async (username,password)=>{
    const user = User.find({ username,password},{password:0,__v:0});
    return user;
}