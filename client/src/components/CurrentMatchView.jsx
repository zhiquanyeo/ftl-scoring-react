import React, { Component } from 'react';
import { Row, Col, Button, Grid } from 'react-bootstrap';

class CurrentMatchView extends Component {
    render() {
        if (!this.props.activeMatch) {
            return <span>No Active Match!</span>
        }
        var matchInfo = this.props.activeMatch;

        var autoButtonDisabled = matchInfo.state !== 'PRE_START';
        var teleopButtonDisabled = matchInfo.state !== 'AUTO_COMPLETE';

        // only show phase timer in AUTO and TELEOP states
        var phaseTimer = 'N/A';

        return (
            <Grid>
                <Row>
                    <Col md={12}>
                        <h4>Match: {matchInfo.matchName}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6} md={6}>
                        <Button disabled={autoButtonDisabled} style={{marginRight: 10}}>Autonomous</Button>
                        <Button disabled={teleopButtonDisabled}>Teleop</Button>
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