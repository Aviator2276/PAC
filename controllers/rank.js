const superagent = require('superagent');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');

const getEventRanking = async (req, res) => {
    const { FRC_BASEURL, FRC_USERNAME, FRC_PASSWORD } = require('../config');
    const apiKey = Buffer.from(FRC_USERNAME + ':' + FRC_PASSWORD).toString('base64');

    const eventCode = req.params.eventCode;
    const season = req.params.season;

    const apiRes = await superagent
        .get(`${FRC_BASEURL}/${season}/rankings/${eventCode}`)
        .set('authorization', 'Basic ' + apiKey)
        .set('cache-control', 'no-cache')
        .set('accept', 'json');
    if (apiRes.error) {
        throw new BadRequestError(apiRes.error);
    }

    let response = {"eventRanks": []}
    apiRes.body.Rankings.forEach((rank) => {
        response.eventRanks.push({
            "rank": rank.rank,
            "teamNumber": rank.teamNumber,
            "rankScore": rank.sortOrder1,
            "wins": rank.wins,
            "losses": rank.losses,
            "ties": rank.ties,
        });
    });
    res.status(StatusCodes.OK).json(response);
}

const getDistrictRanking = async (req, res) => {
    const { FRC_BASEURL, FRC_USERNAME, FRC_PASSWORD } = require('../config');
    const apiKey = Buffer.from(FRC_USERNAME + ':' + FRC_PASSWORD).toString('base64');

    const season = req.params.season;
    const districtCode = req.params.districtCode;
    let response = {"districtRanks": []}
    let pageTotal = 1;

    for (page = 1; page <= pageTotal; page++) {
        const queryParams = [];
        queryParams.push(`districtCode=${districtCode}`);
        queryParams.push(`page=${page}`);
        const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
        const apiRes = await superagent
            .get(`${FRC_BASEURL}/${season}/rankings/district${queryString}`)
            .set('authorization', 'Basic ' + apiKey)
            .set('cache-control', 'no-cache')
            .set('accept', 'json');
        if (apiRes.error) {
            throw new BadRequestError(apiRes.error);
        }

        pageTotal = apiRes.body.pageTotal;
        apiRes.body.districtRanks.forEach((rank) => {
            response.districtRanks.push({
                "rank": rank.rank,
                "teamNumber": rank.teamNumber,
                "totalPoints": rank.totalPoints,
                "qualifiedDCMP": rank.qualifiedDistrictCmp,
                "qualifiedFCMP": rank.qualifiedFirstCmp,
            });
        });
    }
    res.status(StatusCodes.OK).json(response);
}

module.exports = {
    getEventRanking,
    getDistrictRanking,
}