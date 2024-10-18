var express = require('express');
var router = express.Router();
var salesController = require('../controllers/salesController');

router.get('/', salesController.showAll ); //default
router.get('/cart', salesController.getCart );
router.get('/:id_e/deleteFromEvent/:id', salesController.deleteFromEvent );
router.get('/delete/:id', salesController.delete );
router.post('/save', salesController.save);

module.exports = router;