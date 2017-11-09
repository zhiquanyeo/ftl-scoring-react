import React, { Component } from 'react';
import { Grid, Row, Col, ProgressBar } from 'react-bootstrap';
import { connect } from 'react-redux';

class MatchList extends Component {
    render() {
        var matchTitle = "No Current Match";
        var redTeam1 = "";
        var redTeam2 = "";
        var blueTeam1 = "";
        var blueTeam2 = "";
        var timeRemaining = 0;
        var redScore = 0;
        var blueScore = 0;
        var redFouls = 0;
        var redTechFouls = 0;
        var blueFouls = 0;
        var blueTechFouls = 0;

        var timerBarStyle = "danger";
        var timerBarPct = 0;

        if (this.props.activeMatch) {
            matchTitle = "Current Match: " + this.props.activeMatch;
            redTeam1 = this.props.matchInfo.redTeams[0] || 'EMPTY';
            redTeam2 = this.props.matchInfo.redTeams[1] || 'EMPTY';
            blueTeam1 = this.props.matchInfo.blueTeams[0] || 'EMPTY';
            blueTeam2 = this.props.matchInfo.blueTeams[1] || 'EMPTY';

            var points = this.props.scores;
            redScore = points.red.auto + points.red.teleop + points.red.others + points.blue.fouls + points.blue.techFouls;
            blueScore = points.blue.auto + points.blue.teleop + points.blue.others + points.red.fouls + points.red.techFouls;
            
            redFouls = points.red.fouls;
            redTechFouls = points.red.techFouls;
            blueFouls = points.blue.fouls;
            blueTechFouls = points.blue.techFouls;

            timeRemaining = this.props.timeRemaining;
            timerBarPct = ((210 - timeRemaining) / 210) * 100;
            if (this.props.matchInfo.state === 'AUTO' ||
                this.props.matchInfo.state === 'AUTO_COMPLETE') {
                timerBarStyle = 'info';
            }
            else if (this.props.matchInfo.state === 'TELEOP') {
                if (timeRemaining > 20) {
                    timerBarStyle = 'success';
                }
                else {
                    timerBarStyle = 'warning';
                }
            }
            else {
                timerBarStyle = 'danger';
            }
        }

        return (
            <Grid>
                <Row>
                    <Col md={12}>
                        <h1 className="page-header" style={{textAlign: "center"}}>Robo-Lexington Cup</h1>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <h2 style={{textAlign: "center"}}>{matchTitle}</h2>
                    </Col>
                </Row>
                <Row>
                    <Col md={3}>
                        <Row>
                            <Col md={12}>
                                <h3 className="red-team" style={{textAlign: "center"}}>{redTeam1}</h3>
                                <h3 className="red-team" style={{textAlign: "center"}}>{redTeam2}</h3>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={6}>
                        <Row>
                            <ProgressBar now={timerBarPct} bsStyle={timerBarStyle} style={{height: 50}}/>
                        </Row>
                        <Row style={{marginTop: -80}}>
                            <Col md={12} style={{textAlign: "center"}}>
                                <h2>{timeRemaining}</h2>
                            </Col>
                        </Row>
                        <Row style={{marginTop: 10}}>
                            <Col sm={6} style={{backgroundColor: "red", color: "white"}}>
                                <h1 style={{textAlign: "center"}}>{redScore}</h1>
                            </Col>
                            <Col sm={6} style={{backgroundColor: "blue", color: "white"}}>
                                <h1 style={{textAlign: "center"}}>{blueScore}</h1>
                            </Col>
                        </Row>
                        <Row>
                        <Col sm={6}>
                            <h4 className="blue-team">Blue Fouls: {blueFouls}</h4>
                            <h4 className="blue-team">Blue Tech Fouls: {blueTechFouls}</h4>
                        </Col>
                        <Col sm={6}>
                            <h4 className="red-team">Red Fouls: {redFouls}</h4>
                            <h4 className="red-team">Red Tech Fouls: {redTechFouls}</h4>
                        </Col>
                        </Row>
                    </Col>
                    <Col md={3}>
                        <Row>
                            <Col md={12}>
                                <h3 className="blue-team" style={{textAlign: "center"}}>{blueTeam1}</h3>
                                <h3 className="blue-team" style={{textAlign: "center"}}>{blueTeam2}</h3>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Grid>
        );
    }
};

const mapStateToProps = (state, props) => {
    console.log('state: ', state);
    // Look deeeeeeeep
    // We want to return:
    // matchName
    // Red Team array
    // Blue Team array
    // Current points
    // Current Remaining
    // State
    var activeMatchName = state.matchInfo.activeMatch;
    // Look up match Info
    var matchInfo;
    for (var i = 0; i < state.matchInfo.matchList.length; i++) {
        if (state.matchInfo.matchList[i].matchName === activeMatchName) {
            matchInfo = state.matchInfo.matchList[i];
            break;
        }
    }

    return {
        activeMatch: activeMatchName,
        matchInfo: matchInfo,
        scores: state.currentMatch.points,
        timeRemaining: state.currentMatchTimeRemaining || 0,
    }
}

export default connect(mapStateToProps)(MatchList);