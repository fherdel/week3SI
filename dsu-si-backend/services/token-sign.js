const jwt = require('jsonwebtoken');
//debe ir en variable de ambiente
const secret = process.env.SECRET;
const payload ={
    sub: 1,
    role: 'user'
}

module.exports.signToken= (payload) =>{
    return jwt.sign(payload, secret)
}

// const token =  signToken(payload, secret);
// console.log(token)

