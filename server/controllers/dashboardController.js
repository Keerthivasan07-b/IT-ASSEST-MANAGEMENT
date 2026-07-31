const Asset = require('../models/Asset');
const Employee = require('../models/Employee');
const AssetHistory = require('../models/AssetHistory');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const totalAssets = await Asset.countDocuments();
    const availableAssets = await Asset.countDocuments({ status: 'Available' });
    const assignedAssets = await Asset.countDocuments({ status: 'Assigned' });
    const maintenanceAssets = await Asset.countDocuments({ status: 'Maintenance' });
    const brokenAssets = await Asset.countDocuments({ status: 'Broken' });
    const totalEmployees = await Employee.countDocuments();

    // Get recent 5 asset history records
    const recentActivity = await AssetHistory.find()
      .populate('asset', 'assetId assetName category')
      .populate('employee', 'employeeId name department')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalAssets,
        availableAssets,
        assignedAssets,
        maintenanceAssets,
        brokenAssets,
        totalEmployees,
        recentActivity
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
