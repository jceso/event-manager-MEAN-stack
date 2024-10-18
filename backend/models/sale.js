var mongoose = require('mongoose');

var SaleSchema = new mongoose.Schema({
    type_id: String,
    time: Date,
    customer_id: String,
    customer_name: String,
    event_id: String,
    place_id: String
});

module.exports = mongoose.model('Sale', SaleSchema);