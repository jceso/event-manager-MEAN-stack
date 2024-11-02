var mongoose = require('mongoose');
var Sale = require('../models/sale');
var Event = require('../models/event');
var Place = require('../models/place');
var T_types = require('../models/t_type')
var Customer = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../jwtsecret/config');

var saleController = {};

// mostra todos items 
saleController.showAll = function(req, res){
    Sale.find({}).then((dbsales)=>{
        Customer.find({}).then((dbusers) => {
            Event.find({}).then((dbevents) => {
                Place.find({}).then((dbplaces) => {
                    res.render('sales/salesList', {sales: dbsales, users: dbusers, events: dbevents, places: dbplaces});
                }).catch(err => {
                    console.log('Reading error - Places  |  ', err);
                    res.redirect('/error');
                });
            }).catch(err => {
                console.log('Reading error - Events  |  ', err);
                res.redirect('/error');
            });
        }).catch(err => {
            console.log('Reading error - Users  |  ', err);
            res.redirect('/error');
        });
    }).catch(err => {
        console.log('Reading error - Sales  |  ', err);
        res.redirect('/error');
    });
}

// Shows sales for a specified event
saleController.showEvent = function(req, res){
    Event.findOne({ _id : req.params.id_e }).then((event) => {
        T_types.find({ _id: { $in: event.types } }).then(dbtypes => {
            Sale.find({ event_id : event._id}).then((dbsales) => {
                Customer.find({ _id : { $in: dbsales.map(sale => sale.customer_id) } }).then(dbusers => {
                    const salesInfo = dbsales.map(sale => {
                        const type = dbtypes.find(t => t._id.equals(sale.type_id));
                        const customer = dbusers.find(user => user._id.equals(sale.customer_id));
                        return {
                            _id: sale._id,
                            event_name: event.name,
                            event_id: event._id,
                            ticket_type: type ? type.type : 'Unknown',
                            customer_email: customer ? customer.email : 'Unknown',
                            capacity: event.capacity ? event.capacity : 1000  
                        };
                    });
                    res.render('sales/eventSales', { sales: salesInfo });
                }).catch(err => {
                    console.log('Reading error - Users  |  ', err);
                    res.redirect('/error');
                });
            }).catch(err => {
                console.log('Reading error - Sales  |  ', err);
                res.redirect('/error');
            });
        }).catch(err => {
            console.log('Reading error - T_types  |  ', err);
            res.redirect('/error');
        });
    }).catch(err => {
        console.log('Reading error - Event  |  ', err);
        res.redirect('/error');
    });
}

// Shows sales for a specified place
saleController.showPlace = function(req, res){
    Place.findOne({ _id : req.params.id_p }).then((place) => {
        Sale.find({ place_id : place._id}).then((dbsales) => {
            const salesInfo = dbsales.map(sale => {
                return {
                    _id: sale._id,
                    place_name: place.name,
                    place_id: place._id
                };
            });
            res.render('sales/placeSales', { sales: salesInfo });
        }).catch(err => {
            console.log('Reading error - Sales  |  ', err);
            res.redirect('/error');
        });
    }).catch(err => {
        console.log('Reading error - Event  |  ', err);
        res.redirect('/error');
    });
}

// Form to create many tickets by admins (Event)
saleController.formCreateEvent = function(req,res){ 
    Customer.find({}).then(dbcustomers => {
        Event.findOne({ _id : req.params.id_e}).then(event => {
            T_types.find({ event_id : req.params.id_e }).then(dbtypes => {
                Sale.find({ event_id : req.params.id_e }).then(dbsales => {
                    res.render('sales/createForEvent', {event: event, types: dbtypes, customers: dbcustomers, sales: dbsales});
                }).catch(err => {
                    console.log('Reading error - Ticket types  |  ', err);
                    res.redirect('/error');
                });
            }).catch(err => {
                console.log('Reading error - Ticket types  |  ', err);
                res.redirect('/error');
            });
        }).catch(err => {
            console.log('Reading error - Event  |  ', err);
            res.redirect('/error');
        });
    }).catch(err => {
        console.log('Reading error - Customers  |  ', err);
        res.redirect('/error')
    });
}

// Create 1 sale as a response to Event backend form
saleController.createEvent = function(req,res){
    let promises = [];
    var time = new Date();

    for (var i=0; i<req.body.quantity; i++) {
        var sale = new Sale(req.body);
        sale.event_id = req.params.id_e;
        sale.time = time;
        promises.push(sale.save());
    }
    Promise.all(promises).then(() => {
        res.redirect('/events/' + req.params.id_e + '/sales');
    }).catch(err => {
        console.log('Saving error - Sale  |  ', err);
        res.redirect('/error');
    });
}

// Form to create many tickets by admins (Place)
saleController.formCreatePlace = function(req,res){ 
    Place.findOne({ _id : req.params.id_p}).then(place => {
        Sale.find({ place_id : req.params.id_p }).then(dbsales => {
            res.render('sales/createForPlace', {place: place, sales: dbsales});
        }).catch(err => {
            console.log('Reading error - Ticket types  |  ', err);
            res.redirect('/error');
        });
    }).catch(err => {
        console.log('Reading error - Event  |  ', err);
        res.redirect('/error');
    });
}

// Create 1 sale as a response to Place backend form
saleController.createPlace = function(req,res){
    let promises = [];
    var time = new Date();
    console.log(time)

    for (var i=0; i<req.body.quantity; i++) {
        var sale = new Sale(req.body);
        sale.place_id = req.params.id_p;
        sale.time = time;
        promises.push(sale.save());
    }
    Promise.all(promises).then(() => {
        res.redirect('/places');
    }).catch(err => {
        console.log('Saving error - Sale  |  ', err);
        res.redirect('/error');
    });
}

// Create 1 sale as a response to frontend POST
saleController.save = function(req,res){
    var token = req.headers['token'];
    var event_id = req.headers['event_id'];
    var type_name = req.headers['type'];
    var time = new Date();

    jwt.verify(token, config.secret, function(err, decoded) {
        if (err)
            return res.status(500).json({ error: 'Validation Error' });
        
        T_types.findOne({ type: type_name, event_id: event_id }).then((type) => {
            var sale = new Sale({
                time : time,
                customer_id : decoded.id,
                event_id : event_id,
                type_id : type._id
            });
            console.log(sale)
            sale.save().then(savedSale => {
                Customer.findOneAndUpdate({ _id: decoded.id }, { $inc: { points: 1 } }, { new : true })
                .then(updatedUser => {
                    if (!updatedUser)
                        return res.status(404).json({ error: 'User not found' });

                    res.status(200).json(updatedUser);
                }).catch(err => {
                    console.error('Error updating user:', err);
                    res.status(500).json({ error: 'Error updating user' });
                });
            }).catch(err => {
                console.log('Saving error:', err);
                res.status(500).json({ error: 'Saving Error' });
            });
        }).catch(err => {
            console.log('Reading error - Types  |  ', err);
            res.status(500).json({ error: 'Reading Error' });
        });
    }); 
}

// Shows the ticket bought from the specified user
saleController.getCart = function(req, res){
    var token = req.headers['token'];

    jwt.verify(token, config.secret, function(err, decoded) {
        if (err)
            return res.status(500).json({ error: 'Validation Error' });
        Sale.find({ customer_id: decoded.id }).then(dbsales => {
            Event.find({ _id: { $in: dbsales.map(sale => sale.event_id) }}).then((dbevents) => {
                Place.find({ _id: { $in: dbevents.map(event => event.place_id) }}).then((dbplaces) => {
                    T_types.find({ _id: { $in: dbsales.map(sale => sale.type_id) }}).then((dbtypes) => {
                        
                        const salesDetails = dbsales.map(sale => {
                            // Find the corresponding event and type
                            const event = dbevents.find(event => event._id.toString() === sale.event_id);
                            const place = dbplaces.find(place => place._id.toString() === event.place_id);
                            const type = dbtypes.find(t_type => t_type._id.toString() === sale.type_id);

                            // Return the combined data for each sale
                            return {
                                event_name: event ? event.name : null,
                                event_date: event ? event.date : null,
                                place_name: place ? place.name : null,
                                ticket_type: type ? type.type : null
                            };
                        });
                        console.log(salesDetails)
                        res.status(200).json(salesDetails);
                    }).catch(err => {
                        console.log('Reading error - Types   |  ', err);
                        res.status(500).json({ error: 'Reading error - Types' });
                    });
                }).catch(err => {
                    console.log('Reading error - Place   |  ', err);
                    res.status(500).json({ error: 'Reading error - Place' });
                });
            }).catch(err => {
                console.log('Reading error - Events  |  ', err);
                res.status(500).json({ error: 'Reading error - Events' });
            });
        }).catch(err => {
            res.status(404).json({ error: 'Reading error - Sales' });
        })
    })
}
//I need to create an array that contains the value of time contained in dbsales, then for every sale I need the name of event for each sale, the name of place for each sale and I have to  


// Delete 1 sale
saleController.delete = function(req, res){
    Sale.deleteOne({ _id : req.params.id }).then(() => {
            res.redirect('/sales');
        }).catch(err => {
            console.log('Removing error - Sale  |  ', err);
            res.redirect('/error');
    });
}

// Delete 1 sale from the event page
saleController.deleteFromEvent = function(req, res){
    Sale.deleteOne({ _id : req.params.id }).then(() => {
            res.redirect('/events/show/' + req.params.id_e);
        }).catch(err => {
            console.log('Removing error - Sale  |  ', err);
            res.redirect('/error');
    });
}

// Delete 1 sale from the place page
saleController.deleteFromPlace = function(req, res){
    Sale.deleteOne({ _id : req.params.id }).then(() => {
            res.redirect('/events/show/' + req.params.id_e);
        }).catch(err => {
            console.log('Removing error - Sale  |  ', err);
            res.redirect('/error');
    });
}

module.exports = saleController;