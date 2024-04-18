require('dotenv').config();
const cookieParser = require("cookie-parser");
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');

const login = async (req, res) => {
    const passcode = req.body;

    if (!passcode) {
        throw new BadRequestError('Please provide passcode');
    }
    const id = new Date().getDate();
    const token = jwt.sign({ id, passcode }, process.env.JWT_SECRET, {
       expiresIn: '30d',
    });

    res
        .status(StatusCodes.OK)
        .cookie("session_token", token, {
            httpOnly: true,
            secure: true,
        })
        .json({ mesg: "Logged in successfully."});
}

const logout = async (req, res) => {
    res
        .clearCookie("session_token")
        .status(StatusCodes.OK)
        .json({ mesg: "Logged out successfully." });
}

module.exports = {
    login,
    logout
}