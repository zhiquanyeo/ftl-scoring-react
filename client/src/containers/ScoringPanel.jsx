import React, { Component } from 'react';
import { Grid, Row, Col, Button, ButtonToolbar, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';

import { updateAutoPoints, addTeleopPoints } from '../actions/currentMatchActions';

class ScoringPanel extends Component {
    constructor(props) {
        super(props);

        var team = null;
        if (this.props.match && this.props.match.params &&
            this.props.match.params.team) {
            team = this.props.match.params.team.toLowerCase();
        }

        var teamScores = this.props.scores[team];
        if (teamScores) {
            var autoScores = teamScores.autoBreakdown;
            this.state = {
                autoScores: [
                    {
                        baseline: autoScores[0].baseline,
                        penalty: autoScores[0].penalty,
                        goal: autoScores[0].goal
                    },
                    {
                        baseline: autoScores[1].baseline,
                        penalty: autoScores[1].penalty,
                        goal: autoScores[1].goal
                    },
                ],
            }
        }
        else {
            this.state = {
                autoScores: [
                    {baseline: false, penalty: false, goal: false},
                    {baseline: false, penalty: false, goal: false},
                ],
            };
        }
    }

    handleAutoScoreClick(teamNum, scoreType) {
        var team = null;
        if (this.props.match && this.props.match.params &&
            this.props.match.params.team) {
            team = this.props.match.params.team;
        }

        var teamAutoScores = this.props.scores[team].autoBreakdown;

        // Special case for NONE
        if (scoreType === 'none') {
            teamAutoScores[teamNum].baseline = false;
            teamAutoScores[teamNum].penalty = false;
            teamAutoScores[teamNum].goal = false;
        }
        else {
            teamAutoScores[teamNum][scoreType] = !teamAutoScores[teamNum][scoreType];
        }

        this.setState({
            autoScores: teamAutoScores
        })
        this.props.updateAutoPoints(this.props.activeMatch, team, teamAutoScores, this.props.clientId);
    }

    handleTeleopScoring(scoreType, pointVal) {
        var team = null;
        if (this.props.match && this.props.match.params &&
            this.props.match.params.team) {
            team = this.props.match.params.team.toLowerCase();
        }

        this.props.addTeleopPoints(this.props.activeMatch, team, scoreType, pointVal, this.props.clientId);
    }

    render() {
        var team = null;
        if (this.props.match && this.props.match.params &&
            this.props.match.params.team) {
            team = this.props.match.params.team;
        }

        if (team) {
            team = team.toLowerCase();
        }

        if (!team || (team !== 'red' && team !== 'blue')) {
            return (
                <h1>Invalid Team Selected</h1>
            )
        }

        var matchName = "NONE";
        var clientId = this.props.clientId ? this.props.clientId.id : 'N/A';

        var team1Name = "";
        var team2Name = "";

        var team1AutoBaselineChecked = false;
        var team1AutoPenaltyChecked = false;
        var team1AutoGoalChecked = false;


        var team2AutoBaselineChecked = false;
        var team2AutoPenaltyChecked = false;
        var team2AutoGoalChecked = false;

        var autoButtonsDisabled = true;
        var teleopButtonsDisabled = true;

        if (this.props.activeMatch) {
            matchName = this.props.activeMatch;

            if (this.props.matchInfo.state === "AUTO" ||
                this.props.matchInfo.state === "AUTO_COMPLETE") {
                autoButtonsDisabled = false;
            }

            if (this.props.matchInfo.state === "TELEOP") {
                teleopButtonsDisabled = false;
            }

            var teamArray = this.props.matchInfo[team + 'Teams'];
            team1Name = teamArray[0] || "EMPTY";
            team2Name = teamArray[1] || "EMPTY";

            var teamAutoScores = this.props.scores[team].autoBreakdown;
            team1AutoBaselineChecked = teamAutoScores[0].baseline;
            team1AutoPenaltyChecked = teamAutoScores[0].penalty;
            team1AutoGoalChecked = teamAutoScores[0].goal;

            team2AutoBaselineChecked = teamAutoScores[1].baseline;
            team2AutoPenaltyChecked = teamAutoScores[1].penalty;
            team2AutoGoalChecked = teamAutoScores[1].goal;
        }

        var team1AutoNoneChecked = !team1AutoBaselineChecked &&
                                   !team1AutoPenaltyChecked &&
                                   !team1AutoGoalChecked;

        var team2AutoNoneChecked = !team2AutoBaselineChecked &&
                                   !team2AutoPenaltyChecked &&
                                   !team2AutoGoalChecked;
        return (
            <Grid>
                <Row>
                    <Col sm={12}>
                        <h1 className="page-header">Match: {matchName}</h1>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <h2 style={{textAlign: "center", backgroundColor: team, color: "white"}}>{team.toUpperCase()} TEAM</h2>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <h4>Scorer ID: {clientId}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <h3>Autonomous</h3>
                        <Row>
                            <Col xs={3}>
                                <h4>{team1Name}</h4>
                            </Col>
                            <Col xs={8}>
                                <ButtonToolbar>
                                    <Button disabled={autoButtonsDisabled} onClick={(e) => {this.handleAutoScoreClick(0, "none")}} bsStyle={team1AutoNoneChecked ? "danger" : null} bsSize="large">None <Glyphicon glyph="remove" /></Button>
                                    <Button disabled={autoButtonsDisabled} onClick={(e) => {this.handleAutoScoreClick(0, "baseline")}} bsStyle={team1AutoBaselineChecked ? "success" : null} bsSize="large">Neutral Zone <Glyphicon glyph="ok" /></Button>
                                    <Button disabled={autoButtonsDisabled} onClick={(e) => {this.handleAutoScoreClick(0, "penalty")}} bsStyle={team1AutoPenaltyChecked ? "success" : null} bsSize="large">Robot <Glyphicon glyph="ok" /></Button>
                                    <Button disabled={autoButtonsDisabled} onClick={(e) => {this.handleAutoScoreClick(0, "goal")}} bsStyle={team1AutoGoalChecked ? "success" : null} bsSize="large">Drop Target <Glyphicon glyph="ok" /></Button>
                                </ButtonToolbar>
                            </Col>
                        </Row>
                        <Row style={{marginTop: 5}}>
                            <Col xs={3}>
                                <h4>{team2Name}</h4>
                            </Col>
                            <Col xs={8}>
                                <ButtonToolbar>
                                    <Button disabled={autoButtonsDisabled} onClick={(e) => {this.handleAutoScoreClick(1, "none")}} bsStyle={team2AutoNoneChecked ? "danger" : null} bsSize="large">None <Glyphicon glyph="remove" /></Button>
                                    <Button disabled={autoButtonsDisabled} onClick={(e) => {this.handleAutoScoreClick(1, "baseline")}} bsStyle={team2AutoBaselineChecked ? "success" : null} bsSize="large">Neutral Zone <Glyphicon glyph="ok" /></Button>
                                    <Button disabled={autoButtonsDisabled} onClick={(e) => {this.handleAutoScoreClick(1, "penalty")}} bsStyle={team2AutoPenaltyChecked ? "success" : null} bsSize="large">Robot <Glyphicon glyph="ok" /></Button>
                                    <Button disabled={autoButtonsDisabled} onClick={(e) => {this.handleAutoScoreClick(1, "goal")}} bsStyle={team2AutoGoalChecked ? "success" : null} bsSize="large">Drop Target <Glyphicon glyph="ok" /></Button>
                                </ButtonToolbar>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row style={{marginTop: 20}}>
                    <Col xs={12}>
                        <h3>Teleop</h3>
                        <Row>
                            <Col xs={12}>
                                <Button disabled={teleopButtonsDisabled} onClick={(e) => {this.handleTeleopScoring('teleop', 1)}} style={{height: 150}} block bsStyle="success" bsSize="large">ROBOT HIT</Button>
                            </Col>
                        </Row>
                        <Row style={{marginTop: 25}}>
                            <Col xs={5}>
                                <Button disabled={teleopButtonsDisabled} onClick={(e) => {this.handleTeleopScoring('fouls', 1)}} style={{height: 80}} bsStyle="warning" block bsSize="large">FOUL</Button>
                            </Col>
                            <Col xs={5} xsOffset={2}>
                            <Button disabled={teleopButtonsDisabled} onClick={(e) => {this.handleTeleopScoring('techFouls', 5)}} style={{height: 80}} bsStyle="danger" block bsSize="large">TECH FOUL</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Grid>
        );
    }
};

const mapStateToProps = (state, props) => {
    var activeMatchName = state.matchInfo.activeMatch;

    var matchInfo;
    for (var i = 0; i < state.matchInfo.matchList.length; i++) {
        if (state.matchInfo.matchList[i].matchName === activeMatchName) {
            matchInfo = state.matchInfo.matchList[i];
            break;
        }
    }
    return {
        clientId: state.system.id,
        activeMatch: activeMatchName,
        matchInfo: matchInfo,
        scores: state.currentMatch.points
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateAutoPoints: (matchName, side, points, reporter) => {
            dispatch(updateAutoPoints(matchName, side, points, reporter));
        },
        addTeleopPoints: (matchName, side, type, points, reporter) => {
            dispatch(addTeleopPoints(matchName, side, type, points, reporter));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScoringPanel);
