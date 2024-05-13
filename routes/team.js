const express = require('express');

const router = express.Router();
const {
    getTeamInfo,
    getEventTeams
} = require('../controllers/team');

router.route('/:season/:team').get(getTeamInfo);
router.route('/event/:season/:eventCode').get(getEventTeams);

module.exports = router;
