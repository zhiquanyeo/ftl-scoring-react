import React, { Component } from 'react';
import { Row, Col, Button, Grid } from 'react-bootstrap';

class CurrentMatchView extends Component {
    handleStartMode(mode) {
        this.props.onStartMode(this.props.activeMatch.matchName, mode);
    }

    render() {
        if (!this.props.activeMatch) {
            return <span>No Active Match!</span>
        }
        var matchInfo = this.props.activeMatch;

        var autoButtonDisabled = matchInfo.state !== 'PRE_START';
        var teleopButtonDisabled = matchInfo.state !== 'AUTO_COMPLETE';

        // only show phase timer in AUTO and TELEOP states
        var phaseTimer = 'N/A';

        if (matchInfo.state === 'AUTO') {
            phaseTimer = '00:' + (this.props.matchTimeRemaining - 180);
        }
        else if (matchInfo.state === 'TELEOP') {
            // convert to MM:SS
            var timeSec = this.props.matchTimeRemaining % 60;
            var timeMin = Math.floor(this.props.matchTimeRemaining / 60);
            var timeString = (timeMin < 10 ? '0':'') + timeMin + ':' +
                             (timeSec < 10 ? '0':'') + timeSec;
            phaseTimer = timeString;
        }

        return (
            <Grid>
                <Row>
                    <Col md={12}>
                        <h4>Match: {matchInfo.matchName}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6} md={6}>
                        <Button onClick={(e) => this.handleStartMode('auto')} disabled={autoButtonDisabled} style={{marginRight: 10}}>Autonomous</Button>
                        <Button onClick={(e) => this.handleStartMode('teleop')} disabled={teleopButtonDisabled}>Teleop</Button>
                    </Col>
                    <Col sm={6} md={4}>
                        <h4>Current State: {matchInfo.state}</h4>
                        <h4>Phase Time Remaining: {phaseTimer}</h4>
                    </Col>
                </Row>
                
            </Grid>
        );
    }
}

export default CurrentMatchView;