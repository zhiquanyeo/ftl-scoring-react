import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Row, Col, Button, Grid, Form, FormGroup, FormControl } from 'react-bootstrap';

class CurrentMatchView extends Component {
    handleStartMode(mode) {
        this.props.onStartMode(this.props.activeMatch.matchName, mode);
    }

    handleScoreAdjust(side) {
        if (side !== "red" && side !== "blue") {
            return;
        }

        var scoreElem, descriptionElem;
        if (side === 'red') {
            scoreElem = ReactDOM.findDOMNode(this.adjustRedScore);
            descriptionElem =  ReactDOM.findDOMNode(this.adjustRedDescription);
        }
        else {
            scoreElem =  ReactDOM.findDOMNode(this.adjustBlueScore);
            descriptionElem =  ReactDOM.findDOMNode(this.adjustBlueDescription);
        }

        var pointVal = parseInt(scoreElem.value, 10);
        if (isNaN(pointVal)) {
            pointVal = 0;
        }

        this.props.onScoreAdjust(this.props.activeMatch.matchName, side, pointVal, descriptionElem.value);
        scoreElem.value = '';
        descriptionElem.value = '';
    }

    handleCommitScores() {
        this.props.onCommitScore(this.props.activeMatch.matchName);
    }

    render() {
        if (!this.props.activeMatch) {
            return <span>No Active Match!</span>
        }
        var matchInfo = this.props.activeMatch;

        var autoButtonDisabled = matchInfo.state !== 'PRE_START';
        var teleopButtonDisabled = matchInfo.state !== 'AUTO_COMPLETE';
        var adjustmentButtonsDisabled = matchInfo.state !== 'COMPLETE';

        // only show phase timer in AUTO and TELEOP states
        var phaseTimer = 'N/A';
        var autoButtonStyle = 'success';
        var teleopButtonStyle = null;

        if (matchInfo.state === 'AUTO') {
            var autoTimeRemain = this.props.matchTimeRemaining - 120;
            phaseTimer = '00:' + (autoTimeRemain < 10 ? '0':'') + autoTimeRemain;
            autoButtonStyle = 'success';
            teleopButtonStyle = null;
        }
        else if (matchInfo.state === 'AUTO_COMPLETE') {
            autoButtonStyle = 'danger';
            teleopButtonStyle = 'success';
        }
        else if (matchInfo.state === 'TELEOP') {
            // convert to MM:SS
            var timeSec = this.props.matchTimeRemaining % 60;
            var timeMin = Math.floor(this.props.matchTimeRemaining / 60);
            var timeString = (timeMin < 10 ? '0':'') + timeMin + ':' +
                             (timeSec < 10 ? '0':'') + timeSec;
            phaseTimer = timeString;

            teleopButtonStyle = 'success';
            autoButtonStyle = 'danger';
        }
        else if (matchInfo.state === 'COMPLETE') {
            teleopButtonStyle = 'danger';
            autoButtonStyle = 'danger';
        }

        return (
            <Grid>
                <Row>
                    <Col md={12}>
                        <h3>Match: {matchInfo.matchName}</h3>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6} md={6}>
                        <Button bsStyle={autoButtonStyle} onClick={(e) => this.handleStartMode('auto')} disabled={autoButtonDisabled} style={{marginRight: 10}}>Autonomous</Button>
                        <Button bsStyle={teleopButtonStyle} onClick={(e) => this.handleStartMode('teleop')} disabled={teleopButtonDisabled}>Teleop</Button>
                    </Col>
                    <Col sm={6} md={4}>
                        <h4>Current State: {matchInfo.state}</h4>
                        <h4>Phase Time Remaining: {phaseTimer}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <h4>Score Adjustments</h4>
                        <Row>
                            <Col sm={6}>
                                <h5 className="red-team">Red</h5>
                                <Form inline>
                                    <FormGroup>
                                        <FormControl style={{width: 100}} ref={(input) => { this.adjustRedScore = input }} type="text" placeholder="Points" />
                                    </FormGroup>
                                    {' '}
                                    <FormGroup>
                                        <FormControl ref={(input) => { this.adjustRedDescription = input }} type="text" placeholder="Adjustment Description" />
                                    </FormGroup>
                                    {' '}
                                    <Button disabled={adjustmentButtonsDisabled} onClick={(e) => {this.handleScoreAdjust('red')}} bsStyle="danger">Add Points</Button>
                                </Form>
                            </Col>
                            <Col sm={6}>
                                <h5 className="blue-team">Blue</h5>
                                <Form inline>
                                    <FormGroup>
                                        <FormControl style={{width: 100}} ref={(input) => { this.adjustBlueScore = input }} type="text" placeholder="Points" />
                                    </FormGroup>
                                    {' '}
                                    <FormGroup>
                                        <FormControl ref={(input) => { this.adjustBlueDescription = input }} type="text" placeholder="Adjustment Description" />
                                    </FormGroup>
                                    {' '}
                                    <Button disabled={adjustmentButtonsDisabled} onClick={(e) => {this.handleScoreAdjust('blue')}} bsStyle="primary">Add Points</Button>
                                </Form>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row style={{marginTop: 20}}>
                    <Col sm={2}>
                        <Button onClick={(e) => {this.handleCommitScores();}} disabled={adjustmentButtonsDisabled} bsStyle="success">Commit Scores</Button>
                    </Col>
                </Row>

            </Grid>
        );
    }
}

export default CurrentMatchView;
