var mongoose = require('mongoose');

var T_TypeSchema = new mongoose.Schema({
    event_id: String,
    type: String,
    price: Number
});

module.exports = mongoose.model('T_Type', T_TypeSchema);