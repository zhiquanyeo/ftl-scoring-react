import React, { Component } from 'react';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import { connect } from 'react-redux';

function compareTeamRank(a, b) {
    var aRankScore = 0;
    var bRankScore = 0;
    if (a.numMatchesPlayed > 0) {
        aRankScore = (a.rankingPoints / a.numMatchesPlayed).toFixed(2);
    }
    if (b.numMatchesPlayed > 0) {
        bRankScore = (b.rankingPoints / b.numMatchesPlayed).toFixed(2);
    }
    if (aRankScore !== bRankScore) {
        return bRankScore - aRankScore;
    }
    return b.score - a.score;
}

class RankingList extends Component {
    render() {
        var teamList = this.props.teamList || {};
        var scoredTeamList = [];
        var teamNameToId = {};
        var idToScoredTeamMap = {};
        var matchList = this.props.matchList || [];
        var matchListElements;

        Object.keys(teamList).forEach((id) => {
            var teamObj = {
                id: id,
                name: teamList[id],
                score: 0,
                rankingPoints: 0,
                numMatchesPlayed: 0,
                win: 0,
                loss: 0,
                tie: 0
            };

            idToScoredTeamMap[id] = teamObj;

            scoredTeamList.push(teamObj);

            // Also generate the map of name to ID
            teamNameToId[teamList[id]] = id;
        })

        if (scoredTeamList.length === 0) {
            matchListElements = (<tr><td colSpan={7} style={{textAlign: "center"}}>No Teams</td></tr>);
        }
        else {
            // Calculate the points
            for (var i = 0; i < matchList.length; i++) {
                var matchInfo = matchList[i];

                if (!matchInfo.shouldScore) {
                    continue;
                }

                if (matchInfo.state !== 'COMPLETE') {
                    continue;
                }

                var redTeams = matchInfo.redTeams;
                var blueTeams = matchInfo.blueTeams;
                var redScores = matchInfo.scores.red;
                var blueScores = matchInfo.scores.blue;

                var redScoreVal = redScores.auto + redScores.teleop + redScores.others + blueScores.fouls + blueScores.techFouls;
                var blueScoreVal = blueScores.auto + blueScores.teleop + blueScores.others + redScores.fouls + redScores.techFouls;

                for (var j = 0; j < redTeams.length; j++) {
                    var teamId = teamNameToId[redTeams[j]];
                    if (teamId !== undefined) {
                        var teamObj = idToScoredTeamMap[teamId];
                        teamObj.score += redScoreVal;
                        teamObj.numMatchesPlayed++;
                        if (redScoreVal === blueScoreVal) {
                            teamObj.rankingPoints++;
                            teamObj.tie++;
                        }
                        else if (redScoreVal > blueScoreVal) {
                            teamObj.rankingPoints += 2
                            teamObj.win++;
                        }
                        else {
                            teamObj.loss++;
                        }
                    }
                }

                for (var j = 0; j < blueTeams.length; j++) {
                    var teamId = teamNameToId[blueTeams[j]];
                    if (teamId !== undefined) {
                        var teamObj = idToScoredTeamMap[teamId];
                        teamObj.score += blueScoreVal;
                        teamObj.numMatchesPlayed++;
                        if (redScoreVal === blueScoreVal) {
                            teamObj.rankingPoints++;
                            teamObj.tie++;
                        }
                        else if (blueScoreVal > redScoreVal) {
                            teamObj.rankingPoints += 2
                            teamObj.win++;
                        }
                        else {
                            teamObj.loss++;
                        }
                    }
                }
            }

            // Now sort
            scoredTeamList.sort(compareTeamRank);

            matchListElements = scoredTeamList.map((team, idx) => {
                var rankScore = 0;
                if (team.numMatchesPlayed > 0) {
                    rankScore = (team.rankingPoints / team.numMatchesPlayed).toFixed(2);
                }

                var record = team.win + '-' + team.loss + '-' + team.tie;

                return (
                    <tr key={team.id}>
                        <td>{idx+1}</td>
                        <td>{team.name}</td>
                        <td>{rankScore}</td>
                        <td>{team.score}</td>
                        <td>{record}</td>
                        <td>{team.numMatchesPlayed}</td>
                        <td>{team.rankingPoints}</td>
                    </tr>
                )
            });
        }

        return (
            <Grid>
                <Row>
                    <Col md={12}>
                        <h1 className="page-header">Team Ranks</h1>
                        <Table responsive striped>
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Team Name</th>
                                    <th>Ranking Score</th>
                                    <th>Match Points</th>
                                    <th>Record (W-L-T)</th>
                                    <th>Played</th>
                                    <th>Total Ranking Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matchListElements}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Grid>
        );
    }
};

const mapStateToProps = (state, props) => {
    return {
        matchList: state.matchInfo.matchList,
        teamList: state.teamList.teams
    }
}

export default connect(mapStateToProps)(RankingList);