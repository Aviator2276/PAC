const express = require('express');

const router = express.Router();
const {
    getAllMatch,
} = require('../controllers/schedule');

router.route('/:season').get(getAllMatch);

module.exports = router;