const express = require('express');

const router = express.Router();
const {
    getEventRanking,
    getDistrictRanking,
} = require('../controllers/rank');

router.route('/event/:season/:eventCode').get(getEventRanking);
router.route('/district/:season/:districtCode').get(getDistrictRanking);

module.exports = router;