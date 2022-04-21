
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
//Crear nuevo usuario, al crearlo con extio devuelve sus datos con su username
 module.exports.createUser = async (values)=>{
     try {
         const newuser=await User(values).save()
         console.log('values: ', newuser);
        return newuser
     } catch (error) {
        console.log('error: ', error);
        res.status(500).send({valid:false})
     }    
}
//obtener datos del usuario para comprobar si existen, de ser asi devolverlos con el Id, si no false en username
module.exports.loginTry = async (values)=>{
    try {        
        const trylogin=await User.findOne({username:values.username})
        if (trylogin) {
            if (trylogin.password===values.password) {
                return trylogin   
            } else {
                return {username:false}
            }            
        } else {
            return {username:false}
        }
    } catch (error) {
       console.log('error: ', error);
       res.status(500).send({valid:false})
    }    
}
