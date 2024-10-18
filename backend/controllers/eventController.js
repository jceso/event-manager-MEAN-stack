var mongoose = require('mongoose');
var Event = require('../models/event');
var Place = require('../models/place');
var T_Type = require('../models/t_type');
var Sale = require('../models/sale');
const event = require('../models/event');

var eventController = {};

// Shows all the events 
eventController.showAll = function (req, res) {
    Event.find({}).then(dbevents => {
        Place.find({}).then(dbplaces => {
            res.render('items/itemList', { items: dbevents, places: dbplaces });
        }).catch(err => {
            console.log('Places reading error', err);
            res.redirect('/error');
        });
    }).catch(err => {
        console.log('Events reading error', err);
        res.redirect('/error');
    });
}

// Sends the events to the frontend
eventController.showAll2 = function (req, res) {
    Event.find({}).then(dbevents => {
        res.status(200).json(dbevents);
    }).catch(err => {
        console.log('Reading error - Events for the frontend');
        res.status(500).json({ error: 'Reading error - Events' });
    })
}

// mostra 1 item por id
eventController.show = function (req, res) {
    Event.findOne({ _id: req.params.id }).then(dbevent => {
        T_Type.find({ event_id: dbevent._id }).then(dbtype => {
            Place.findOne({ _id: dbevent.place_id }).then(dbplace => {
                Sale.find({ event_id: dbevent._id }).then(sales => {
                    res.render('items/itemViewDetails', { item: dbevent, place: dbplace, types: dbtype, sales:(sales.length>0?true:false) });
                }).catch(err => {
                    console.log('Places reading error', err);
                    res.redirect('/error');
                });
            }).catch(err => {
                console.log('Places reading error', err);
                res.redirect('/error');
            });
        }).catch(err => {
            console.log('Places reading error', err);
            res.redirect('/error');
        });
    }).catch(err => {
        console.log('Event reading error', err);
        res.redirect('/error');
    });
}

// form para criar 1 item
eventController.formCreate = function (req, res) {
    Place.find({}).then(dbplaces => {
        res.render('items/createForm', { places: dbplaces });
    }).catch(err => {
        console.log('Event reading error', err);
        res.redirect('/error');
    });
}

// Create 1 event as a response to a POST of a form
eventController.create = async function (req, res) {
    try {
        const existingEvent = await Event.findOne({ date: req.body.date, place_id: req.body.place_id });
        if (existingEvent) {
            console.log('Saving error - This event already exists');
            return res.redirect('/events/create');
        }

        const event = new Event({
            _id: new mongoose.Types.ObjectId(),
            ...req.body
        });
        await event.save();

        res.redirect(event._id + '/tickets/type');
    } catch (err) {
        console.log('Saving error:', err);
        res.redirect('/error');
    }
};

// Shows 1 event to edit
eventController.formEdit = function (req, res) {
    Event.findOne({ _id : req.params.id }).then(dbevent => {
        Place.find({}).then(dbplaces => {
            T_Type.find({ event_id : req.params.id }).then(dbtypes => {
                res.render('items/itemEditDetails', {item: dbevent, places: dbplaces, types: dbtypes });
            }).catch(err => {
                console.log('Reading error - Ticket types  |  ', err);
                res.redirect('/error');
            });
        }).catch(err => {
            console.log('Reading error - Places', err);
            res.redirect('/error');
        });
    }).catch(err => {
        console.log('Reading error - Event', err);
        res.redirect('/error');
    });
}

// Edits 1 event as a response of a POST of an edit form
eventController.edit = function (req, res) {
    Event.findByIdAndUpdate(req.body._id, req.body, { new: true }).then(editedItem => {
            if (!editedItem) {
                console.log('No event found with the given ID');
                res.redirect('/error');
            } else
                res.redirect('/events/show/' + req.body._id);
        }).catch(err => {
            console.log('Error updating event  |  ', err);
            res.redirect('/error');
        });
};

// Eliminate 1 event
eventController.delete = function (req, res) {
    Sale.deleteMany({ event_id: req.params.id }).then(() => {
        T_Type.deleteMany({ event_id: req.params.id }).then(() => {
            Event.deleteOne({ _id: req.params.id }).then(() => {
                res.redirect('/events');
            }).catch(err => {
                console.log('Removing error - Tickets  |  ', err);
                res.redirect('/error');
            });
        }).catch(err => {
            console.log('Removing error - Types  |  ', err);
            res.redirect('/error');
        });
    }).catch(err => {
        console.log('Removing error - Sale  |  ', err);
        res.redirect('/error');
    });
};

// Sends event details to the detailed event page in the frontend
eventController.eventDetails = function (req, res) {
    var eventId = req.body.eventId;
    console.log("ID: ", eventId)

    Event.findOne({ _id: eventId }).then((event) => {
        console.log("Event found  -  ", event.name);
        Place.findOne({ _id: event.place_id }).then((place) => {
            T_Type.find({ _id: { $in: event.types } }).then((types) => {
                var details = {
                    name: event.name,
                    date: event.date,
                    place: place.name,
                    t_types: [],
                    details: event.details
                }

                for(let i=0; i<types.length; i++) {
                    let type = {
                        name: types[i].type,
                        price: types[i].price
                    }
                    details.t_types.push(type);
                }
    
                console.log(details);
                res.status(200).json(details);
            }).catch(err => {
                console.log('Reading error - Types   |  ', err);
                res.status(500).json({ error: 'Reading error - Place' });
            });
        }).catch(err => {
            console.log('Reading error - Place   |  ', err);
            res.status(500).json({ error: 'Reading error - Place' });
        });
    }).catch(err => {
        console.log('Reading error - Events  |  ', err);
        res.status(500).json({ error: 'Reading error - Events' });
    });
};


module.exports = eventController;