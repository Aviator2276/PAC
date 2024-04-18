const express = require('express');

const router = express.Router();
const {
    getAllMatch,
    getNextMatch,
    getAlliance
} = require('../controllers/schedule');

router.route('/:season').get(getAllMatch);
router.route('/next/:season').get(getNextMatch);
router.route('/alliance/:season').get(getAlliance);

module.exports = router;