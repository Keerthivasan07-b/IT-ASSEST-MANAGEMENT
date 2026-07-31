const Employee = require('../models/Employee');
const Asset = require('../models/Asset');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
const getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json({ success: true, count: employees.length, data: employees });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single employee by ID
// @route   GET /api/employees/:id
// @access  Private
const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }
    res.json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new employee
// @route   POST /api/employees
// @access  Admin
const createEmployee = async (req, res, next) => {
  try {
    const { employeeId, name, department, designation, email, phone } = req.body;

    const existingEmpId = await Employee.findOne({ employeeId });
    if (existingEmpId) {
      return res.status(400).json({ success: false, message: 'Employee ID already exists.' });
    }

    const existingEmail = await Employee.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Employee email already exists.' });
    }

    const employee = await Employee.create({
      employeeId,
      name,
      department,
      designation,
      email,
      phone
    });

    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Admin
const updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    res.json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Admin
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    // Check if employee has assigned assets
    const assignedAssets = await Asset.find({ assignedTo: req.params.id });
    if (assignedAssets.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete employee with assigned assets. Please return assets first.'
      });
    }

    await employee.deleteOne();
    res.json({ success: true, message: 'Employee removed successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
