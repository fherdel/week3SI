const res = require("express/lib/response");
const User = require("../schemas/user.schema");
const jwt = require('jsonwebtoken');
// Get all users
module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).send(users);
  } catch (error) {
    console.log("error: ", error);
   return res.status(500).send({ valid: false });
  }
};

/**
 * add here post for users
 */
module.exports.createUser = async (req, res) => {

  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });
    const newUser = await user.save();
    const token = generateAccessToken( {id:newUser._id} );

    return res.status(200).send({user:user,token:token});
  } catch (e) {
   return res.status(400).send({ valid: false });
  }
};

//Login
module.exports.Login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }); 
    
     
    if (user === null) {
        return res.status(403).send("User not found");
    }
    if(user.password !== req.body.password){
        return res.status(405).send("Credentials not valid");
    }
    const token = generateAccessToken( {id:user._id} );
    return res.status(200).send({user:user,token:token});
  } catch (error) {
    console.log("error: ", error);
   return res.status(500).send({ valid: false });
  }
};

function generateAccessToken(id) {
  process.env.TOKEN_SECRET;
  try{
  return jwt.sign(id, process.env.TOKEN_SECRET, { expiresIn: '1800s' });}
  catch(e){
    console.log(e)
  }
}
// app.post('/api/createNewUser', (req, res) => {
//   // ...

//   const token = generateAccessToken({ username: req.body.username });
//   res.json(token);

//   // ...
// });