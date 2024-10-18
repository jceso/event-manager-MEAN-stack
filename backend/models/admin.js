var mongoose = require('mongoose');

var AdminSchema = new mongoose.Schema({
    name: String,
    phonenumber: String,
    email: String,
    administrator: Boolean,
});

module.exports = mongoose.model('Admin', AdminSchema);