const express = require('express');

const studentController = require('./controllers');


const router = express.Router();
router.route('/').get(studentController.getAllStudents);
router.route('/:id').get(studentController.getStudentById);
router.route('/:id').patch(studentController.updateStudentById);
router.route('/:id').delete(studentController.deleteStudentById);


module.exports = router;