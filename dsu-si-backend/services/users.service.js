
const UserModel =require("../schemas/user.schema")

// Get all users
module.exports.getUsers = async (req, res) => {
	try {
        const users = await UserModel.find()
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
module.exports.createUser = async (user, password)=>{
    console.log('values: ', user, password);
    const newUser = new UserModel({user,password});
    user.save();
    return {user,password}
}

module.exports.logIn = async(user, password)=>{
    const verifyUser = await UserModel.findOne({user});
    if (verifyUser.password === password) {
        const {id} = verifyUser;
        return{
            id
        }
    } else {
        
    }
}