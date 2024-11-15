const superagent = require('superagent');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');

const getMatchSchedule = async (req, res) => {
    const { FRC_BASEURL, FRC_USERNAME, FRC_PASSWORD, TBA_BASEURL, TBA_KEY, TBA_PASSWORD } = require('../config');
    const apiKey = Buffer.from(FRC_USERNAME + ':' + FRC_PASSWORD).toString('base64');

    const { teamNumber } = req.query;
    const eventCode = req.params.eventCode;
    const season = req.params.season;
    const queryParams = [];
    queryParams.push(`teamNumber=${teamNumber}`);
    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';

    const frcAPIRes = await superagent
        .get(`${FRC_BASEURL}/${season}/schedule/${eventCode}${queryString}`)
        .set('authorization', 'Basic ' + apiKey)
        .set('cache-control', 'no-cache')
        .set('accept', 'json');
    if (frcAPIRes.error) {
        throw new BadRequestError(frcAPIRes.error);
    }
    const tbaAPIRes = await superagent
        .get(`${TBA_BASEURL}/event/${season}${eventCode.toLowerCase()}/matches/simple`)
        .set(TBA_KEY, TBA_PASSWORD)
        .set('cache-control', 'no-cache')
        .set('accept', 'json');
    if (tbaAPIRes.error) {
        throw new BadRequestError(tbaAPIRes.error);
    }

    const response = {"Schedule": []}
    const tbaMatchLookup = [];
    tbaAPIRes.body.forEach((match) => {
        const teamKeys = match.alliances.blue.team_keys.concat(match.alliances.red.team_keys);
        if (teamKeys.includes(`frc${teamNumber}`)) {
            tbaMatchLookup[match.time] = [match.predicted_time, match.actual_time];
        }
    });
    frcAPIRes.body.Schedule.forEach((match) => {
        const expectedTime = Math.floor(Date.parse(match.startTime) / 1000);
        const [predictedTime, actualTime] = tbaMatchLookup[expectedTime] || [];

        response.Schedule.push({
            "matchNumber": match.matchNumber,
            "description": match.description,
            "tournamentLevel": match.tournamentLevel,
            "redAlliance": match.teams.slice(0, 3).map(team => team.teamNumber),
            "blueAlliance": match.teams.slice(3).map(team => team.teamNumber),
            "expectedTime": expectedTime,
            "predictedTime": predictedTime,
            "actualTime": actualTime,
        });
    });
    res.status(StatusCodes.OK).json(response);
}

const notifyStream = async (req, res) => {

}

const validationTBAWebHook = async (req, res) => {

}


module.exports = {
    getMatchSchedule,
}