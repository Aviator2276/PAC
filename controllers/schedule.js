require('dotenv').config();
const superagent = require('superagent');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError, CustomAPIError } = require('../errors');

const getAllMatch = async (req, res) => {
    const { FRC_BASEURL, FRC_USERNAME, FRC_PASSWORD } = require('../config');
    const apiKey = Buffer.from(FRC_USERNAME + ':' + FRC_PASSWORD).toString('base64');

    const { eventCode, teamNumber, tournamentLevel } = req.query;
    const season = req.params.season;
    const queryParams = [];
    if (tournamentLevel) queryParams.push(`tournamentLevel=${tournamentLevel}`);
    if (teamNumber > 0) queryParams.push(`teamNumber=${teamNumber}`);
    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';

    const apiRes = await superagent
        .get(`${FRC_BASEURL}/${season}/schedule/${eventCode}${queryString}`)
        .set('authorization', 'Basic ' + apiKey)
        .set('cache-control', 'no-cache')
        .set('accept', 'json');
    if (apiRes.error) {
        throw new CustomAPIError(apiRes.error);
    }
    res.status(StatusCodes.OK).json(apiRes.body);
}

const getNextMatch = async (req, res) => {
    const { FRC_BASEURL, FRC_USERNAME, FRC_PASSWORD } = require('../config');
    const apiKey = Buffer.from(FRC_USERNAME + ':' + FRC_PASSWORD).toString('base64');
    const timeNow = Date.now();
    console.log(timeNow);

    const { eventCode, teamNumber, tournamentLevel } = req.query;
    const season = req.params.season;
    const queryParams = [];
    if (tournamentLevel) queryParams.push(`tournamentLevel=${tournamentLevel}`);
    if (teamNumber > 0) queryParams.push(`teamNumber=${teamNumber}`);
    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';

    const apiRes = await superagent
        .get(`${FRC_BASEURL}/${season}/schedule/${eventCode}${queryString}`)
        .set('authorization', 'Basic ' + apiKey)
        .set('cache-control', 'no-cache')
        .set('accept', 'json');
    if (apiRes.error) {
        throw new CustomAPIError(apiRes.error);
    }
    res.status(StatusCodes.OK).json(apiRes.body);
}

const getAlliance = async (req, res) => {
    const { FRC_BASEURL, FRC_USERNAME, FRC_PASSWORD } = require('../config');
    const apiKey = Buffer.from(FRC_USERNAME + ':' + FRC_PASSWORD).toString('base64');

    const { eventCode } = req.query;
    const season = req.params.season;

    const apiRes = await superagent
        .get(`${FRC_BASEURL}/${season}/alliances/${eventCode}`)
        .set('authorization', 'Basic ' + apiKey)
        .set('cache-control', 'no-cache')
        .set('accept', 'json');
    if (apiRes.error) {
        throw new CustomAPIError(apiRes.error);
    }
    res.status(StatusCodes.OK).json(apiRes.body);
}

module.exports = {
    getAllMatch,
    getNextMatch,
    getAlliance
}