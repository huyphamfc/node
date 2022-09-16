const express = require('express');
const userController = require('../controllers/country-controller');


const router = express.Router();
router.get('/', userController.getAllCountries);
router.get('/:id', userController.getCountry);


module.exports = router;