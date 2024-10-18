var mongoose = require('mongoose');
var Place = require('../models/place');
var Sale = require('../models/sale');
var Event = require('../models/event');

var placeController = {};

// Show all the places 
placeController.showAll = function(req, res){
    Place.find({}).then(dbplaces => {
        res.render('places/placeList', { places: dbplaces });
    }).catch(err => {
        console.log('Reading error - Places  |  ', err);
        res.redirect('/error');
    });
}

placeController.showAll2 = function(req, res){
    Place.find({}).then(dbplaces => {
        res.status(200).json(dbplaces);
    }).catch(err => {
        console.log('Reading error - Places for the frontend');
        res.status(500).json({ error: err })
    })
}

// Form to create 1 place
placeController.formCreate = function(req,res){
    res.render('places/createForm');
}

// Create 1 place as response of POST of form
placeController.create = function (req, res) {
    const place = new Place(req.body);
    place.save().then(() => {
            res.redirect('/places');
        }).catch(err => {
            console.log('Saving error - Place  |  ', err);
            res.redirect('/error');
        });
}

// Show 1 place to edit
placeController.formEdit = function(req, res){
    Place.findOne({_id: req.params.id}).then(dbplace => {
        res.render('places/placeEditDetails', { place: dbplace });
    }).catch(err => {
        console.log('Reading error - Place  |  ', err);
        res.redirect('/error');
    });
}

// Edit 1 place as response of POST edit form
placeController.edit = function(req,res){
    Place.findByIdAndUpdate(req.body._id, req.body, { new: true }).then(editedPlace => {
        if (!editedPlace){
            console.log('No place found with the given ID');
            res.redirect('/error')
        } else
            res.redirect('/places');
    }).catch(err => {
        console.log('Error updating place  |  ', err);
        res.redirect('/error');
    });
}

// Eliminate 1 place
placeController.delete = function(req, res){
    Event.deleteMany({place_id: req.params.id}).then(() =>{
        Sale.deleteMany({place_id: req.params.id}).then(() => {
            Place.deleteOne({_id: req.params.id}).then(() => {
                res.redirect('/places')
            }).catch(err => {
                console.log('Deleting error - Place  |  ', err);
                res.redirect('/error');
            });
        }).catch(err => {
            console.log('Deleting error - Sales  |  ', err);
            res.redirect('/error');
        });
    }).catch(err => {
        console.log('Deleting error - Events  |  ', err);
        res.redirect('/error');
    });
}

module.exports = placeController;