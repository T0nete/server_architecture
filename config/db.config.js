const mongoose = require('mongoose')

const dbConfig = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Connected to MongoDB')
    })
    .catch((error) => {
      console.error(error)
    })
}

module.exports = dbConfig
