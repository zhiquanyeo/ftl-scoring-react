import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

class MatchList extends Component {
    render() {
        console.log(this.props);
        return (
            <Grid>
                <Row>
                    <Col>
                        Hi I'm the scoring panel for team {this.props.match.params.team}
                    </Col>
                </Row>
            </Grid>
        );
    }
};

export default MatchList;