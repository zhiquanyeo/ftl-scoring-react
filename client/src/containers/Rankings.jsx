import React, { Component } from 'react';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import { connect } from 'react-redux';

function compareTeamRank(a, b) {
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
                score: 0
            };

            idToScoredTeamMap[id] = teamObj;

            scoredTeamList.push(teamObj);

            // Also generate the map of name to ID
            teamNameToId[teamList[id]] = id;
        })

        if (scoredTeamList.length === 0) {
            matchListElements = (<tr><td colSpan={3} style={{textAlign: "center"}}>No Teams</td></tr>);
        }
        else {
            // Calculate the points
            for (var i = 0; i < matchList.length; i++) {
                var matchInfo = matchList[i];

                if (!matchInfo.shouldScore) {
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
                        idToScoredTeamMap[teamId].score += redScoreVal;
                    }
                }

                for (var j = 0; j < blueTeams.length; j++) {
                    var teamId = teamNameToId[blueTeams[j]];
                    if (teamId !== undefined) {
                        idToScoredTeamMap[teamId].score += blueScoreVal;
                    }
                }
            }

            // Now sort
            scoredTeamList.sort(compareTeamRank);

            matchListElements = scoredTeamList.map((team, idx) => {
                return (
                    <tr key={team.id}>
                        <td>{idx+1}</td>
                        <td>{team.name}</td>
                        <td>{team.score}</td>
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
                                    <th>Points</th>
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