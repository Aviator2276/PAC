const express = require('express');

const router = express.Router();
const {
    getEventRanking,
    getDistrictRanking,
} = require('../controllers/rank');

router.route('/event/:season').get(getEventRanking);
router.route('/district/:season').get(getDistrictRanking);

module.exports = router;