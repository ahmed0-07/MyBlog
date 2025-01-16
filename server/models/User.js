const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        requrid: true
    }
});

module.exports = mongoose.model('User', userSchema);