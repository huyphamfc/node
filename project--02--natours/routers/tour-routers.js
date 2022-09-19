const express = require('express');
const tourController = require('../controllers/tour-controllers');


const router = express.Router();
router.route('/').get(tourController.getAllTours);
router.route('/').post(tourController.createTour);


module.exports = router;