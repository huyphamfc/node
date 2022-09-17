const express = require('express');
const controller = require('./controller');


const router = express.Router();

router.route('/').get(controller.getData);
router.route('/:id').get(controller.getDataById);


module.exports = router;