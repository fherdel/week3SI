const jwt = require('jsonwebtoken');
//debe ir en variable de ambiente
const secret = process.env.SECRET;
// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjUwOTA2MzU4fQ.OcrC_iL5rcIppDn0zCfbLamY8OP-BdAWok2GcezfjNc'


module.exports.verifyToken= (token) =>{
    return jwt.verify(token, secret)
}

// const payload =  verifyToken(token, secret);
// console.log(payload)
