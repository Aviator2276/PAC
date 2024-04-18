const express = require('express');

const router = express.Router();
const { login, logout } = require('../controllers/auth');

router.route('/login').post(login);
router.route('/logout').get(logout);

module.exports = router;