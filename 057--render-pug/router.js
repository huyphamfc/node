const express = require('express');
const controllers = require('./controllers');

const router = express();
router.route('/').get(controllers.renderUI('overview'));
router.route('/about').get(controllers.renderUI('about'));
router.route('/products').get(controllers.renderUI('products'));

module.exports = router;
