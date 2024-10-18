var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name: String,
    phonenumber: String,
    email: String,
    password: String,
    points: Number,
    role: {
        type: String,
        enum: ['ADMIN', 'USER'],
        default: 'USER'
    }
});

module.exports = mongoose.model('User', UserSchema);