const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.route('/')
  .get(getEmployees)
  .post(isAdmin, createEmployee);

router.route('/:id')
  .get(getEmployeeById)
  .put(isAdmin, updateEmployee)
  .delete(isAdmin, deleteEmployee);

module.exports = router;
