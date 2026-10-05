const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6
    },
    role: {
      type: String,
      enum: ['Admin', 'Employee'],
      default: 'Admin'
    }
  },
  { timestamps: true }
);

// Compare password helper method (unhashed plain text, with fallback for existing hashed passwords)
userSchema.methods.comparePassword = async function (enteredPassword) {
  // Direct plain text comparison
  if (this.password === enteredPassword) {
    return true;
  }
  // Fallback for any legacy bcrypt hashed passwords in database
  if (this.password && (this.password.startsWith('$2a$') || this.password.startsWith('$2b$'))) {
    return await bcrypt.compare(enteredPassword, this.password);
  }
  return false;
};

module.exports = mongoose.model('User', userSchema);
