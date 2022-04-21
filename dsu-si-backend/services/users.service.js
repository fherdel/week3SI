const User = require("../schemas/user.schema");

// Get all users
module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return {
      error: false,
      data: users,
    };
  } catch (error) {
    console.log("error: ", error);
    res.status(500).send({ error });
  }
};

/**
 * add here post for users
 */
module.exports.createUser = async (values) => {
  let { username, password } = values;
  try {
    const users = await User.find({ username });

    // Validate that the username is available
    if (users.length === 0) {
      const newUser = new User({
        username: username,
        password: password,
      });
      //   Create a new user
      newUser.save((err, doc) => {
        if (!err) {
          return {
            error: false,
            data: doc,
          };
        } else {
          return { error: err };
        }
      });
    } else {
      return {
        error: "Username has already been used",
      };
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(500).send({ valid: false });
  }
};

module.exports.loginUser = async (values) => {
  let { username, password } = values;
  try {
    const users = await User.find({ username, password });

    // Validate  if the username and password are correct
    if (users.length === 0) {
      return {
        error: "Username or password are incorrect",
      };
    } else {
      return {
        error: '',
        data: users[0]
      };
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(500).send({ valid: false });
  }
};


module.exports.clearUsers = async () => {
  try {
    await User.deleteMany();
    return {
      error: "",
      data: [],
    };
  } catch (error) {
    return {
      error,
    };
  }
};


