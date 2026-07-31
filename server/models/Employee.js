const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Employee Name is required'],
      trim: true
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);
