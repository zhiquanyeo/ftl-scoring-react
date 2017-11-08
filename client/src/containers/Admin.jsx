import React, { Component } from 'react';
import { Grid, Row, Col, Panel, PanelGroup } from 'react-bootstrap';
import { connect } from 'react-redux';

import CurrentMatchView from '../components/CurrentMatchView'
import MatchAdminList from '../components/MatchAdminList';

import MatchUtil from '../utils/matchUtil';

class AdminView extends Component {
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
                                <CurrentMatchView activeMatch={activeMatch}/>
                            </Panel>
                            <Panel header="Teams" bsStyle="warning" eventKey="adminTeams">Teams</Panel>
                            <Panel header="Matches" bsStyle="success" eventKey="adminMatches">
                                <MatchAdminList />
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
        }
    }
}

export default connect(mapStateToProps)(AdminView);