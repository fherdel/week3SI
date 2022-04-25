
const UserModel = require("../schemas/user.schema")
const {verifyToken} = require('./token-verify')
const {signToken} = require('./token-sign')
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
        console.log(verifyUser)
        if (verifyUser === null) {
            const token = signToken({username, password})
            console.log('values: ', username, password, token);
            const newUser = new UserModel({token, username,password});
            newUser.save();
            return newUser
        }else{
            throw Error('theres already one with that same username')
        }
        
    } catch (error) {
        console.log(error)
    }
}

module.exports.logIn = async(username, password)=>{
    const verifyUser = await UserModel.findOne({username,password});
    if (verifyUser.password === password) {
        return{
            verifyUser
        }
    } else {
        throw Error('password doesnt match')
    }
}