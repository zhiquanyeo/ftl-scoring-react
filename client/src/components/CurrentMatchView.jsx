import React, { Component } from 'react';
import { Row, Col, Button, Grid } from 'react-bootstrap';

class CurrentMatchView extends Component {
    render() {
        if (!this.props.activeMatch) {
            return <span>No Active Match!</span>
        }
        var matchInfo = this.props.activeMatch;

        var autoButtonDisabled = matchInfo.state !== 'PRE_START';
        var teleopButtonDisabled = matchInfo.state !== 'PRE_START' &&
                                   matchInfo.state !== 'AUTO' &&
                                   matchInfo.state !== 'AUTO_COMPLETE';

        return (
            <Grid>
                <Row>
                    <Col md={12}>
                        <h4>Match: {matchInfo.matchName}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        Current State: {matchInfo.state}
                    </Col>
                </Row>
                <Row>
                    <Col sm={6} md={6}>
                        <Button disabled={autoButtonDisabled} style={{marginRight: 10}}>Autonomous</Button>
                        <Button disabled={teleopButtonDisabled}>Teleop</Button>
                    </Col>
                    <Col sm={2} md={2}>
                        
                    </Col>
                </Row>
                
            </Grid>
        );
    }
}

export default CurrentMatchView;