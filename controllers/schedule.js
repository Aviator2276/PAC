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
    const tbaMatches = [];
    tbaAPIRes.body.forEach((match) => {
        if (match.alliances.blue.team_keys.includes(`frc${teamNumber}`)) tbaMatches.push([ match.time, match.predicted_time, match.actual_time ]);
        else if (match.alliances.red.team_keys.includes(`frc${teamNumber}`)) tbaMatches.push([ match.time, match.predicted_time, match.actual_time ]);
    });
    frcAPIRes.body.Schedule.forEach((match) => {
        const expectedTime = Math.floor(Date.parse(match.startTime) / 1000);
        const predictedTime = tbaMatches.find(tbaMatch => tbaMatch[0] === expectedTime)?.[1];
        const actualTime = tbaMatches.find(tbaMatch => tbaMatch[0] === expectedTime)?.[2];
        console.log(predictedTime)

        response.Schedule.push({
            "matchNumber": match.matchNumber,
            "description": match.description,
            "tournamentLevel": match.tournamentLevel,
            "redAlliance": [
                match.teams[0].teamNumber,
                match.teams[1].teamNumber,
                match.teams[2].teamNumber,
            ],
            "blueAlliance": [
                match.teams[3].teamNumber,
                match.teams[4].teamNumber,
                match.teams[5].teamNumber,
            ],
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