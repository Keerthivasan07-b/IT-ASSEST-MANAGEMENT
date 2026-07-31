const express = require('express');
const router = express.Router();
const {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  assignAsset,
  returnAsset,
  getAssetHistory
} = require('../controllers/assetController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.use(verifyToken);

// Special actions & history routes
router.post('/assign', isAdmin, assignAsset);
router.post('/return', isAdmin, returnAsset);
router.get('/history', getAssetHistory);
router.get('/:id/history', getAssetHistory);

// CRUD routes
router.route('/')
  .get(getAssets)
  .post(isAdmin, createAsset);

router.route('/:id')
  .get(getAssetById)
  .put(isAdmin, updateAsset)
  .delete(isAdmin, deleteAsset);

module.exports = router;
