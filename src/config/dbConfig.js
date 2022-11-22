const mongoose = require('mongoose');

const connect = (MONGO_URI) => {
    mongoose
        .connect(MONGO_URI)
        .then(() => console.log('Connected to MongoDB Atlas'))
        .catch((error) => console.error(error));
}

module.exports = { connect}