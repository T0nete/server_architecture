const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;

MongoMemoryServer.create()
    .then((mongoServer) => {
        return mongoose.connect(mongoServer.getUri(), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'posts',
        });
    })
    .then(() => console.log('MongoDB Connected') )
    .catch((err) => {
        console.error(err);
    });