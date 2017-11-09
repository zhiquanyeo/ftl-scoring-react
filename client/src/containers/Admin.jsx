import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Grid, Row, Col, Panel, PanelGroup, Form, FormGroup, FormControl, Button } from 'react-bootstrap';
import { connect } from 'react-redux';

import CurrentMatchView from '../components/CurrentMatchView'
import MatchAdminList from '../components/MatchAdminList';

import MatchUtil from '../utils/matchUtil';

import {addMatch} from '../actions/matchActions';

class AdminView extends Component {
    handleAddMatch() {
        console.log('this.props ', this.props);
        var matchNameElem = ReactDOM.findDOMNode(this.addMatchName);
        var redTeamsElem = ReactDOM.findDOMNode(this.addRedTeams);
        var blueTeamsElem = ReactDOM.findDOMNode(this.addBlueTeams);
        console.log('Match Name: ', matchNameElem.value);

        var matchName = matchNameElem.value;
        var redTeams = redTeamsElem.value.split(';');
        var blueTeams = blueTeamsElem.value.split(';');
        // Add the match and clear out the values
        this.props.addMatch(matchName, redTeams, blueTeams);

        matchNameElem.value = "";
        redTeamsElem.value = "";
        blueTeamsElem.value = "";
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
                                <CurrentMatchView activeMatch={activeMatch}/>
                            </Panel>
                            <Panel header="Teams" bsStyle="warning" eventKey="adminTeams">Teams</Panel>
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
        }
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addMatch: (matchName, redTeams, blueTeams) => {
            dispatch(addMatch(matchName, redTeams, blueTeams));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminView);