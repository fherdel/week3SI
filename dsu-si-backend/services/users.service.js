
const UserModel = require("../schemas/user.schema")

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
module.exports.createUser = async (username, password)=>{
    try {
        let verifyUser = await UserModel.findOne({username});
        console.log(verifyUser + " xlll")
        if (verifyUser === null) {
            console.log('values: ', username, password);
            const newUser = new UserModel({username,password});
            // console.log(verifyUser)
            // const verifyUser = await UserModel.findOne({username});
            newUser.save();
            return {verifyUser}
        }else{
            console.log('theres already one')
            throw Error('theres already one with that same username')
        }
        
    } catch (error) {
        console.log(error)
    }
}

module.exports.logIn = async(username, password)=>{
    const verifyUser = await UserModel.findOne({username});
    // console.log(verifyUser)
    // console.log('llll')
    if (verifyUser.password === password) {
        return{
            verifyUser
        }
    } else {
        throw Error('password doesnt match')
    }
}