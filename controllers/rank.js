require('dotenv').config();
const superagent = require('superagent');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');

const getEventRanking = async (req, res) => {
    const { FRC_BASEURL, FRC_USERNAME, FRC_PASSWORD } = require('../config');
    const apiKey = Buffer.from(FRC_USERNAME + ':' + FRC_PASSWORD).toString('base64');

    const { eventCode, teamNumber } = req.query;
    const season = req.params.season;
    const queryParams = [];
    if (teamNumber > 0) queryParams.push(`teamNumber=${teamNumber}`);
    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';

    const apiRes = await superagent
        .get(`${FRC_BASEURL}/${season}/rankings/${eventCode}${queryString}`)
        .set('authorization', 'Basic ' + apiKey)
        .set('cache-control', 'no-cache')
        .set('accept', 'json');
    if (apiRes.error) {
        throw new BadRequestError(apiRes.error);
    }
    res.status(StatusCodes.OK).json(apiRes.body);
}

const getDistrictRanking = async (req, res) => {
    const { FRC_BASEURL, FRC_USERNAME, FRC_PASSWORD } = require('../config');
    const apiKey = Buffer.from(FRC_USERNAME + ':' + FRC_PASSWORD).toString('base64');

    const { districtCode, teamNumber, pageNumber } = req.query;
    const season = req.params.season;
    const queryParams = [];
    if (districtCode) queryParams.push(`districtCode=${districtCode}`);
    if (teamNumber > 0) queryParams.push(`teamNumber=${teamNumber}`);
    if (pageNumber > 0) queryParams.push(`page=${pageNumber}`);
    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';

    const apiRes = await superagent
        .get(`${FRC_BASEURL}/${season}/rankings/district${queryString}`)
        .set('authorization', 'Basic ' + apiKey)
        .set('cache-control', 'no-cache')
        .set('accept', 'json');
    if (apiRes.error) {
        throw new BadRequestError(apiRes.error);
    }
    res.status(StatusCodes.OK).json(apiRes.body);
}

module.exports = {
    getEventRanking,
    getDistrictRanking,
}