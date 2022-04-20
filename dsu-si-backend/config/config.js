require('dotenv').config()

const credentials = {
    mongo: {
        uri: `${process.env.MONGO_URL}`,     
    }
}

module.exports = credentials;