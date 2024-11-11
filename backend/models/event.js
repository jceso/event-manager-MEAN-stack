var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
    _id: String,
    name: String,
    date: Date,
    place_id: String,
    details: String,
    types: [String],
    capacity: Number
});

module.exports = mongoose.model('Event', EventSchema);