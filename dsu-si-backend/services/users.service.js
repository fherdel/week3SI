const res = require("express/lib/response");
const User = require("../schemas/user.schema");

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
    await user.save();
    return res.send(user);
  } catch (e) {
   return res.status(400).send({ valid: false });
  }
};

//Login
module.exports.Login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (user === null) {
        return res.status(403).send("User not found");
    }
    if(user.password !== req.body.password){
        return res.status(405).send("Credentials not valid");
    }
    return res.status(200).send(user);
  } catch (error) {
    console.log("error: ", error);
   return res.status(500).send({ valid: false });
  }
};
