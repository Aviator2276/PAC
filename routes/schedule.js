const express = require('express');

const router = express.Router();
const {
    getMatchSchedule,
} = require('../controllers/schedule');

router.route('/matches/:season/:eventCode').get(getMatchSchedule);
//router.route('/validate').post()
//router.route('/match-notification').get()

module.exports = router;