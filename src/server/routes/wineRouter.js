const express = require('express');

const router = express.Router();
const { getWineDetails, getWineDetail, getBreakDownByType } = require('../controllers/wineController');

router.route('/').get(getWineDetails);

router.route('/:id').get(getWineDetail);

router.route('/:id/breakdown/:type').get(getBreakDownByType);

module.exports = router;
