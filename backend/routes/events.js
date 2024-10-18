var express = require('express');
var router = express.Router();
var eventController = require('../controllers/eventController');
var saleController = require('../controllers/salesController');
var t_TypeController = require('../controllers/t_typeController');

router.get('/', eventController.showAll); //Default
router.get('/showAll', eventController.showAll2); //Json
router.get('/show/:id', eventController.show);
router.get('/create', eventController.formCreate);
router.post('/create', eventController.create);
router.get('/edit/:id', eventController.formEdit);
router.post('/edit/:id', eventController.edit);
router.get('/delete/:id', eventController.delete);
router.post('/eventDetails', eventController.eventDetails);

router.get('/:id_e/sales', saleController.showEvent);
router.get('/:id_e/tickets/create', saleController.formCreateEvent);
router.post('/:id_e/tickets/create', saleController.createEvent);

router.get('/:id_e/tickets/allTypes', t_TypeController.showAll);
router.get('/:id_e/tickets/type', t_TypeController.formCreate);
router.post('/:id_e/tickets/allTypes', t_TypeController.create);
router.get('/:id_e/tickets/edit/:id', t_TypeController.formEdit);
router.post('/:id_e/tickets/edit', t_TypeController.edit);
router.get('/:id_e/tickets/remove/:id', t_TypeController.delete);

module.exports = router;