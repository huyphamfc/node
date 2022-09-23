const express = require('express');
const orderController = require('./controllers');


const router = express.Router();

router.route('/').get(orderController.getAllOrders);

router
    .route('/stats')
    .get(orderController.getOrderStats);


module.exports = router;