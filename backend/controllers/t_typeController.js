var mongoose = require('mongoose');
var Event = require('../models/event');
var T_type = require('../models/t_type')

var t_TypeController = {};

// Show all the places 
t_TypeController.showAll = function(req, res){
    Event.findOne({ _id : req.params.id_e }).then(dbevent => {
        console.log("Event structure: " + dbevent)
        T_type.find({ event_id : dbevent._id }).then((dbtype) => {
            res.render('t_types/typeList', {event: dbevent, types: dbtype});
        }).catch(err => {
            console.log('Reading error - Ticket types  |  ', err);
            res.redirect('/error');
        });
    }).catch(err => {
        console.log('Reading error - Event  |  ', err);
        res.redirect('/error');
    })
}

// Form to create 1 type
t_TypeController.formCreate = function(req,res){
    Event.findOne({ _id : req.params.id_e }).then(event => {
        res.render('t_types/createForm', {event: event});
    }).catch(err => {
        console.log('Reading error - Event  |  ', err);
        res.redirect('/error');
    })
}

// Create 1 type as response of POST of form
t_TypeController.create = async function(req,res){
    var existingType = await T_type.findOne({ event_id : req.params.id_e, type : req.body.type });
    if (existingType) {
        console.log('Saving error - This ticket type already exists');
        return res.redirect('/events/' + req.params.id_e + '/tickets/type');
    }
    
    var type = new T_type(req.body);
    type.save().then(savedType => {    
        // Find the event by ID and update its types array
        Event.findOneAndUpdate({ _id: req.params.id_e },  // Filter to find the event
            { $push: { types: savedType._id } })
            .then(() => {
                res.redirect('/events/' + req.params.id_e + '/tickets/allTypes');
        }).catch(err => {
            console.log('Reading error - Event  |  ', err);
            res.redirect('/error');
        });
    }).catch(err => {
        console.log('Saving error - Ticket Type  |  ', err);
        res.redirect('/error');
    });
}

// Show 1 place to edit
t_TypeController.formEdit = function(req, res){
    T_type.findOne({ _id : req.params.id }).then(dbtype => {
        Event.findOne({ _id : dbtype.event_id }).then(dbevent => {
            res.render('t_types/typeEditDetails', {type: dbtype, event: dbevent});
        }).catch(err => {
            console.log('Reading error - Event  |  ', err);
            res.redirect('/error');
        })
    }).catch(err => {
        console.log('Reading error - Ticket types  |  ', err);
        res.redirect('/error');
    })
}

// Edit 1 place as response of POST edit form
t_TypeController.edit = function(req,res){
    T_type.findByIdAndUpdate(req.body._id, req.body, { new: true }).then(editedType => {
        if (!editedType){
            console.log('No type found with the given ID');
            res.redirect('/error')
        } else {
           res.redirect('/events/' + editedType.event_id + '/tickets/allTypes');
        }
    }).catch(err => {
        console.log('Error updating ticket type  |  ', err);
        res.redirect('/error');
    });
}

// Eliminate 1 type
t_TypeController.delete = function(req, res){
    T_type.findOne({ _id : req.params.id }).then((type) => {
        Event.findByIdAndUpdate(type.event_id, { $pull: { types: type._id } }, { new: true }).then((updatedEvent) => {
            if (!updatedEvent)
                return res.status(404).json({ error: 'Event not found' });

            // Now, delete the T_Type itself
            T_type.findByIdAndDelete(type._id).then(() => {
                console.log("Type removed from the event and deleted");
                res.redirect('/events/' + req.params.id_e + '/tickets/allTypes');
            }).catch((err) => {
                console.log('Deleting error - Ticket type');
                res.redirect('/error');
            });
        }).catch((err) => {
            console.log('Updating error - Event');
            res.redirect('/error');
        });
    }).catch(err => {
        console.log('Reading error - Ticket type');
        res.redirect('/error');
    });
}

module.exports = t_TypeController;