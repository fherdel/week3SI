
const User=require("../schemas/user.schema")

// Get all users
const getUsers = async (req, res) => {
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
 const createUser = async (values)=>{
     try {
        const user = await User(values).save()
        return {message:null, data:user} 
     } catch (error) {
         console.error(error.message)
         return {message:error,data:null}
     }
}

const login = async (values) => {
    try {
        const user = await User.findOne({username:values.username})
        return {message:null,data:user}
    } catch (error) {
        return {message:error,data:null}
    }
}
 
module.exports={getUsers,createUser,login}