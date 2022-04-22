require('dotenv').config()

const credentials = {
    mongo: {
        host: `${process.env.MONGO_HOST}`,     
    }
}

module.exports = credentials;