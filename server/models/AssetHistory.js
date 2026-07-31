const mongoose = require('mongoose');

const assetHistorySchema = new mongoose.Schema(
  {
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: true
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    assignedDate: {
      type: Date,
      default: Date.now,
      required: true
    },
    returnedDate: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('AssetHistory', assetHistorySchema);
