const mongoose = require('mongoose');

const connectDB = () => {
    mongoose.connect(process.env.DATABASE_URL)
        .then(() => {
            console.log('connected to database...');
        })
        .catch(err => {
            console.log(err);
        })
}

module.exports = connectDB;