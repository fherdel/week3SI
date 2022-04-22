
const dotenv = require('dotenv');
const jwt = require("jsonwebtoken");

// get config vars
dotenv.config();

function generateAccessToken(username) {
    try {
        return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
    } catch (error) {
        console.error(error.message)
    }
}

function authenticateToken(req, res, next) {
    
    const authHeader = req.headers['authorization']
    console.log("Auth",req.headers)
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.status(401).json({message:'No authorized',data:null})
  
    jwt.verify(token, process.env.TOKEN_SECRET , (err, user) => {
      console.log(err)
  
      if (err) return res.status(403).json({message:err, data:null})
      req.user = user
      next()
    })
  }


module.exports = {
    generateAccessToken,
    authenticateToken
}
