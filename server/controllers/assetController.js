const Asset = require('../models/Asset');
const Employee = require('../models/Employee');
const AssetHistory = require('../models/AssetHistory');

// @desc    Get all assets with optional search and filter
// @route   GET /api/assets
// @access  Private
const getAssets = async (req, res, next) => {
  
  try {
    const { search, status, category } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { assetName: { $regex: search, $options: 'i' } },
        { assetId: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } }
      ];
    }

    const assets = await Asset.find(query).populate('assignedTo', 'name email employeeId department').sort({ createdAt: -1 });

    res.json({ success: true, count: assets.length, data: assets });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single asset by ID
// @route   GET /api/assets/:id
// @access  Private
const getAssetById = async (req, res, next) => {
  try {
    const asset = await Asset.findById(req.params.id).populate('assignedTo', 'name email employeeId department designation phone');
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found.' });
    }
    res.json({ success: true, data: asset });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new asset
// @route   POST /api/assets
// @access  Admin
const createAsset = async (req, res, next) => {
  try {
    const { assetId, assetName, category, brand, model, serialNumber, purchaseDate, warrantyExpiry, price, status } = req.body;

    const existingAsset = await Asset.findOne({ assetId });
    if (existingAsset) {
      return res.status(400).json({ success: false, message: 'Asset ID already exists.' });
    }

    const asset = await Asset.create({
      assetId,
      assetName,
      category,
      brand,
      model,
      serialNumber,
      purchaseDate,
      warrantyExpiry,
      price,
      status: status || 'Available'
    });

    res.status(201).json({ success: true, data: asset });
  } catch (error) {
    next(error);
  }
};

// @desc    Update asset
// @route   PUT /api/assets/:id
// @access  Admin
const updateAsset = async (req, res, next) => {
  try {
    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('assignedTo', 'name email employeeId');

    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found.' });
    }

    res.json({ success: true, data: asset });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete asset
// @route   DELETE /api/assets/:id
// @access  Admin
const deleteAsset = async (req, res, next) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found.' });
    }

    if (asset.status === 'Assigned') {
      return res.status(400).json({ success: false, message: 'Cannot delete an assigned asset. Return it first.' });
    }

    // Clean up history
    await AssetHistory.deleteMany({ asset: req.params.id });
    await asset.deleteOne();

    res.json({ success: true, message: 'Asset and history removed successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign asset to employee
// @route   POST /api/assets/assign
// @access  Admin
const assignAsset = async (req, res, next) => {
  try {
    const { assetId, employeeId } = req.body;

    if (!assetId || !employeeId) {
      return res.status(400).json({ success: false, message: 'Please provide both assetId and employeeId.' });
    }

    const asset = await Asset.findById(assetId);
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found.' });
    }

    if (asset.status !== 'Available') {
      return res.status(400).json({ success: false, message: `Asset is currently ${asset.status} and cannot be assigned.` });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    // Update asset
    asset.status = 'Assigned';
    asset.assignedTo = employee._id;
    await asset.save();

    // Create history record
    const history = await AssetHistory.create({
      asset: asset._id,
      employee: employee._id,
      assignedDate: new Date()
    });

    res.json({
      success: true,
      message: `Asset '${asset.assetName}' assigned to ${employee.name} successfully.`,
      data: asset,
      history
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Return assigned asset
// @route   POST /api/assets/return
// @access  Admin
const returnAsset = async (req, res, next) => {
  try {
    const { assetId } = req.body;

    if (!assetId) {
      return res.status(400).json({ success: false, message: 'Please provide assetId.' });
    }

    const asset = await Asset.findById(assetId);
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found.' });
    }

    if (asset.status !== 'Assigned') {
      return res.status(400).json({ success: false, message: 'Asset is not currently assigned.' });
    }

    const previousEmployeeId = asset.assignedTo;

    // Update active history record
    await AssetHistory.findOneAndUpdate(
      { asset: asset._id, employee: previousEmployeeId, returnedDate: null },
      { returnedDate: new Date() },
      { sort: { createdAt: -1 } }
    );

    // Update asset status
    asset.status = 'Available';
    asset.assignedTo = null;
    await asset.save();

    res.json({
      success: true,
      message: `Asset '${asset.assetName}' has been returned and is now Available.`,
      data: asset
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get asset assignment history
// @route   GET /api/assets/history
// @route   GET /api/assets/:id/history
// @access  Private
const getAssetHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = id ? { asset: id } : {};

    const history = await AssetHistory.find(query)
      .populate('asset', 'assetId assetName category brand model')
      .populate('employee', 'employeeId name department email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: history.length, data: history });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  assignAsset,
  returnAsset,
  getAssetHistory
};
