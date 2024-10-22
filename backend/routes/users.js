var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');

router.get('/', userController.showAll); //default
router.get('/admins', userController.showAdmins);
router.get('/show/:id', userController.show);
router.post('/login', userController.check); // Frontend login
router.post('/register', userController.register); // Frontend register
router.post('/edit', userController.editClient); // Frontend edit
router.get('/create', userController.formCreate);
router.post('/create', userController.create);
router.get('/edit/:id', userController.formEdit);
router.post('/edit/:id', userController.edit);
router.get('/delete/:id', userController.delete)
router.get('/user-info-endpoint', userController.profile);
module.exports = router;