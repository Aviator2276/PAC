const superagent = require('superagent');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');

const getTeamInfo = async (req, res) => {
    const { FRC_BASEURL, FRC_USERNAME, FRC_PASSWORD } = require('../config');
    const apiKey = Buffer.from(FRC_USERNAME + ':' + FRC_PASSWORD).toString('base64');

    const teamNumber = req.params.teamNumber;
    const season = req.params.season;
    const queryParams = [];
    if (teamNumber > 0) queryParams.push(`teamNumber=${teamNumber}`);
    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';

    const apiRes = await superagent
        .get(`${FRC_BASEURL}/${season}/teams${queryString}`)
        .set('authorization', 'Basic ' + apiKey)
        .set('cache-control', 'no-cache')
        .set('accept', 'json');
    if (apiRes.error) {
        throw new BadRequestError(apiRes.error);
    }

    let response = {"Teams": []}
    apiRes.body.teams.forEach((team) => {
        response.Teams.push({
            "teamNumber": team.teamNumber,
            "nameShort": team.nameShort,
        });
    });
    res.status(StatusCodes.OK).json(response);
}

const getEventTeams = async (req, res) => {
    const { FRC_BASEURL, FRC_USERNAME, FRC_PASSWORD } = require('../config');
    const apiKey = Buffer.from(FRC_USERNAME + ':' + FRC_PASSWORD).toString('base64');

    const eventCode = req.params.eventCode;
    const season = req.params.season;
    const queryParams = [];
    queryParams.push(`eventCode=${eventCode}`);
    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';

    const apiRes = await superagent
        .get(`${FRC_BASEURL}/${season}/teams${queryString}`)
        .set('authorization', 'Basic ' + apiKey)
        .set('cache-control', 'no-cache')
        .set('accept', 'json');
    if (apiRes.error) {
        throw new BadRequestError(apiRes.error);
    }

    let response = {"Teams": []}
    apiRes.body.teams.forEach((team) => {
        response.Teams.push({
            "teamNumber": team.teamNumber,
            "nameShort": team.nameShort,
        });
    });
    res.status(StatusCodes.OK).json(response);
}

module.exports = {
    getTeamInfo,
    getEventTeams
}