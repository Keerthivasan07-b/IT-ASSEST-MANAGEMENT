const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema(
  {
    assetId: {
      type: String,
      required: [true, 'Asset ID is required'],
      unique: true,
      trim: true
    },
    assetName: {
      type: String,
      required: [true, 'Asset Name is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required (e.g. Laptop, Monitor, Keyboard, Software)'],
      trim: true
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true
    },
    model: {
      type: String,
      default: '',
      trim: true
    },
    serialNumber: {
      type: String,
      default: '',
      trim: true
    },
    purchaseDate: {
      type: Date,
      required: [true, 'Purchase Date is required']
    },
    warrantyExpiry: {
      type: Date
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive']
    },
    status: {
      type: String,
      enum: ['Available', 'Assigned', 'Maintenance', 'Broken'],
      default: 'Available'
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Asset', assetSchema);
