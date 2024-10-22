var mongoose = require('mongoose');
var User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../jwtsecret/config');
const user = require('../models/user');

var userController = {};

// Show all users
userController.showAll = function (req, res) {
    User.find({}).then(dbusers => {
            res.render('users/personList', { users: dbusers });
        }).catch(err => {
            console.log('Reading error - Users  |  ', err);
            res.redirect('/error');
        });
};

// Show all admins
userController.showAdmins = function (req, res) {
    User.find({ role: 'ADMIN' }).then(dbadmins => {
            res.render('users/adminList', { users: dbadmins });
        }).catch(err => {
            console.log('Reading error - Admins  |  ', err);
            res.redirect('/error');
        });
};

// Show 1 user by id
userController.show = function (req, res) {
    User.findOne({ _id: req.params.id }).then(dbuser => {
        res.render('users/personViewDetails', { user: dbuser });
    }).catch(err => {
        console.log('Reading error');
        res.redirect('/error');
    });
}

// Frontend login
userController.check = function(req, res){
    User.findOne({ email: req.body.e }).then(user => {
        if (!user)
            return res.status(404).json({ error: 'No user found' });
        
        // check if the password is valid
        var passwordIsValid = bcrypt.compareSync(req.body.pw, user.password);
        
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

        // if user is found and password is valid
        // create a token
        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });

        // return the information including token as JSON
        res.status(200).send({ auth: true, token: token });
    }).catch(err => {
        console.log("err: ", err);
        return res.status(500).json({ error: 'Error on the server' });
    });
}

// Frontend register
userController.register = async function(req, res){
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            console.log('There is already a user with this email');
            return res.status(404).json({ error: 'One user found' });
        }

        var hashedPassword = bcrypt.hashSync(req.body.password, 8);

        const user = new User({
            name : req.body.name,
            email : req.body.email,
            password : hashedPassword,
            role: "USER",
            points: 0
        });
        await user.save();

        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });

        res.status(200).send({ auth: true, token: token, name: user.name });
    } catch (err) {
        console.log('Saving error:', err);
        return res.status(500).json({ error: 'Error on the server' });
    }
}

// Frontend edit profile
userController.editClient = async function(req, res){
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(404).json({ error: 'No user found' });

        User.findByIdAndUpdate(user._id, user, { new: true }).then(editedUser => {
            if (!editedUser){
                console.log('No user found with the given ID');
                res.redirect('/error');
            }
            var token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });
    
            res.status(200).send({ auth: true, token: token, name: user.name });
        }).catch(err => {
            console.log('Saving error - User  |  ', err);
            res.redirect('/error')
        });
        
    } catch (err) {
        console.log("err: ", err);
        return res.status(500).json({ error: 'Error on the server' });
    };
}

// Form to create 1 user
userController.formCreate = function (req, res) {
    res.render('users/createForm');
}

// Create 1 user as a responde of a POST of a form
userController.create = function (req, res) {
    var user = new User({
        points: 0,
        ...req.body
    });

    console.log(user);

    user.save().then(() => {
        res.redirect('/users');
    }).catch(err => {
        console.log('Saving error - User  |  ', err);
        res.redirect('/error');
    });
}

// Show 1 user to edit
userController.formEdit = function (req, res) {
    User.findOne({ _id: req.params.id }).then(dbuser => {
        res.render('users/personEditDetails', { user: dbuser });
    }).catch(err => {
        console.log('Reading error - User  |  ', err);
        res.redirect('/error')
    });
}

// Edit 1 user as a response of a POST of an edit form
userController.edit = function (req, res) {
    User.findByIdAndUpdate(req.body._id, req.body, { new: true }).then(editedUser => {
        if (!editedUser){
            console.log('No user found with the given ID');
            res.redirect('/error');
        } else
            res.redirect('/users/show/' + req.body._id);
    }).catch(err => {
        console.log('Saving error - User  |  ', err);
        res.redirect('/error')
    });
}

// Eliminate 1 user
userController.delete = function (req, res) {
    User.deleteOne({ _id: req.params.id }).then(() => {
        res.redirect('/users');
    }).catch(err => {
        console.log('Reading error - User  |  ', err);
        res.redirect('/error');
    });
}

// Get profile infos
userController.profile = function (req, res) {
    var token = req.headers['token'];

    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
            console.error("JWT validation error: ", err);
            return res.status(500).json({ error: 'Validation Error', details: err.message });
        }

        User.findOne({_id: decoded.id}).then(user => {
            console.log("User found: ", user);
            res.status(200).json(user);
        }).catch(err => {
            console.log("User not found with ID: ", decoded.id);
            return res.status(404).json({ error: 'User not found' });
        });
    });
};

module.exports = userController;