
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

// Verify if a username exists in the db already
module.exports.verifyIfUserExists = async (values) => {
    let { username } = values;
	try {
        const user = await User.find({ username });
        if(user.length !== 0) {
            return { status: false };    
        } else {
            return { status: true };
        }
    }
    catch (error) {
        console.log('error: ', error);
        res.status(500).send({valid:false})
    }
}

/**
 * user creation 
 */
 module.exports.createUser = async (values)=>{
    console.log('values: ', values);
    try {
        //verify if a username already exists in the db
        const verification = await this.verifyIfUserExists(values);
        //if a user doesn't exist in the db adds a new one
        if(verification.status === true) { 
            const user = await User(values).save();
            return user;
        //if a user exists in the db returns an error message
        } else {
            return { error: 'You cannot use this username, it has already been taken.' };
        }
    } catch(error) {
        console.log("error: ", error);
        res.status(500).send({ valid: false });
    }
}

module.exports.login = async (values) => {
    //object destructuration
    let { username, password } = values; 
    try {
        const user = await User.findOne({ username, password });
        if(user !== null) {
            return user;
        } else {
            return { error: 'Username or password is incorrect, please verify and try again.'};
        }
    } catch(error) {
        console.log("error: ", error);
        res.status(500).send({ valid: false });
    }
};