import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Grid, Row, Col, Panel, PanelGroup, Form, FormGroup, FormControl, Button, Checkbox } from 'react-bootstrap';
import { connect } from 'react-redux';

import CurrentMatchView from '../components/CurrentMatchView'
import MatchAdminList from '../components/MatchAdminList';
import TeamListView from '../components/TeamListView';

import MatchUtil from '../utils/matchUtil';

import {addMatch} from '../actions/matchActions';
import {addTeam, deleteTeam} from '../actions/teamActions';
import {startMatchMode, addAdjustmentPoints, commitScore} from '../actions/currentMatchActions';

class AdminView extends Component {
    handleAddMatch() {
        var matchNameElem = ReactDOM.findDOMNode(this.addMatchName);
        var redTeamsElem = ReactDOM.findDOMNode(this.addRedTeams);
        var blueTeamsElem = ReactDOM.findDOMNode(this.addBlueTeams);
        var scoreMatchElem = ReactDOM.findDOMNode(this.addScoreMatch);

        var matchName = matchNameElem.value;
        var redTeams = redTeamsElem.value.split(';');
        var blueTeams = blueTeamsElem.value.split(';');

        var shouldScoreMatch = scoreMatchElem.checked;

        // Add the match and clear out the values
        this.props.addMatch(matchName, redTeams, blueTeams, shouldScoreMatch);

        matchNameElem.value = "";
        redTeamsElem.value = "";
        blueTeamsElem.value = "";
        scoreMatchElem.checked = true;
    }

    handleAddTeam() {
        var teamIdElem = ReactDOM.findDOMNode(this.addTeamId);
        var teamNameElem = ReactDOM.findDOMNode(this.addTeamName);

        var teamId = teamIdElem.value;
        var teamName = teamNameElem.value;

        this.props.addTeam(teamId, teamName);

        teamIdElem.value = "";
        teamNameElem.value = "";
    }

    handleDeleteTeam(teamId) {
        this.props.deleteTeam(teamId);
    }

    handleStartMode(matchName, mode) {
        this.props.startMatchMode(matchName, mode);
    }

    handleScoreAdjust(matchName, side, points, description) {
        this.props.adjustScore(matchName, side, points, description);
    }

    handleCommitScore(matchName) {
        this.props.commitScore(matchName);
    }

    render() {
        var activeMatch = MatchUtil.getActiveMatch(this.props.tournamentInfo);
        
        return (
            <Grid>
                <Row>
                    <Col md={12}>
                        <h1 className="page-header">Tournament Administration</h1>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <PanelGroup defaultActiveKey="adminCurrMatch">
                            <Panel header="Current Match" bsStyle="primary" eventKey="adminCurrMatch">
                                <CurrentMatchView currentScores={this.props.currentScores} 
                                        matchTimeRemaining={this.props.matchTimeRemaining} 
                                        activeMatch={activeMatch} 
                                        onStartMode={this.handleStartMode.bind(this)} 
                                        onScoreAdjust={this.handleScoreAdjust.bind(this)}
                                        onCommitScore={this.handleCommitScore.bind(this)}/>
                            </Panel>
                            <Panel header="Teams" bsStyle="warning" eventKey="adminTeams">
                                <TeamListView teamList={this.props.teamList} onDeleteTeam={this.handleDeleteTeam.bind(this)}/>
                                <Form inline>
                                    <FormGroup>
                                        <FormControl ref={(input) => { this.addTeamId = input }} type="text" placeholder="Team ID"/>
                                    </FormGroup>
                                    {' '}
                                    <FormGroup>
                                        <FormControl ref={(input) => { this.addTeamName = input }} type="text" placeholder="Team Name"/>
                                    </FormGroup>
                                    {' '}
                                    <Button bsStyle="primary" onClick={(e) => this.handleAddTeam() }>Add Team</Button>
                                </Form>
                            </Panel>
                            <Panel header="Matches" bsStyle="success" eventKey="adminMatches">
                                <MatchAdminList />
                                <Form inline>
                                    <FormGroup>
                                        <FormControl ref={(input) => { this.addMatchName = input; }} type="text" placeholder="Match Name"/>
                                    </FormGroup>
                                    {' '}
                                    <FormGroup>
                                        <FormControl ref={(input) => { this.addRedTeams = input; }} type="text" placeholder="Red Teams"/>
                                    </FormGroup>
                                    {' '}
                                    <FormGroup>
                                        <FormControl ref={(input) => { this.addBlueTeams = input; }} type="text" placeholder="Blue Teams"/>
                                    </FormGroup>
                                    {' '}
                                    <FormGroup>
                                        <Checkbox inputRef={(input) => { this.addScoreMatch = input; }}>Score Match</Checkbox>
                                    </FormGroup>
                                    {' '}
                                    <Button bsStyle="primary" onClick={(e) => this.handleAddMatch() }>Add Match</Button>
                                </Form>
                            </Panel>
                        </PanelGroup>
                    </Col>
                </Row>
            </Grid>
        );
    }
};

const mapStateToProps = (state, props) => {
    return {
        tournamentInfo: {
            activeMatch: state.matchInfo.activeMatch,
            matchList: state.matchInfo.matchList
        },
        teamList: state.teamList.teams,
        matchTimeRemaining: state.currentMatchTime.timeRemaining,
        currentScores: state.currentMatch.points
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addMatch: (matchName, redTeams, blueTeams, shouldScore) => {
            dispatch(addMatch(matchName, redTeams, blueTeams, shouldScore));
        },
        addTeam: (teamId, teamName) => {
            dispatch(addTeam(teamId, teamName));
        },
        deleteTeam: (teamId) => {
            dispatch(deleteTeam(teamId));
        },
        startMatchMode: (matchName, mode) => {
            dispatch(startMatchMode(matchName, mode));
        },
        adjustScore: (matchName, side, points, description) => {
            dispatch(addAdjustmentPoints(matchName, side, points, description));
        },
        commitScore: (matchName) => {
            dispatch(commitScore(matchName));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminView);