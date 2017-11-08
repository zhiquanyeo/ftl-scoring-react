import React, { Component } from 'react';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import { connect } from 'react-redux';

import ScoreUtil from '../utils/scoreUtil';

class MatchList extends Component {
    render() {
        var matchList = this.props.matchList || [];
        var matchListElements;
        if (matchList.length === 0) {
            matchListElements = (<tr><td colSpan="7" style={{textAlign: "center"}}>No Matches Listed</td></tr>);
        }
        else {
            matchListElements = matchList.map((matchInfo) => {
                var scores = ScoreUtil.calculateScores(matchInfo);
                var activeClassName = (matchInfo.matchName === this.props.activeMatch) ? "active-match" : null;
                return (
                    <tr key={matchInfo.matchName} className={activeClassName}>
                        <td>{matchInfo.matchName}</td>
                        <td className="red-team">{matchInfo.redTeams[0] || 'EMPTY'}</td>
                        <td className="red-team">{matchInfo.redTeams[1] || 'EMPTY'}</td>
                        <td className="blue-team">{matchInfo.blueTeams[0] || 'EMPTY'}</td>
                        <td className="blue-team">{matchInfo.blueTeams[1] || 'EMPTY'}</td>
                        <td className="red-team">{scores.red}</td>
                        <td className="blue-team">{scores.blue}</td>
                    </tr>
                );
            })
        }

        return (
            <Grid>
                <Row>
                    <Col md={12}>
                        <h1 className="page-header">Match List</h1>
                        <Table responsive striped>
                            <thead>
                                <tr>
                                    <th>Match</th>
                                    <th className='red-team'>Red Team 1</th>
                                    <th className='red-team'>Red Team 2</th>
                                    <th className='blue-team'>Blue Team 1</th>
                                    <th className='blue-team'>Blue Team 2</th>
                                    <th className='red-team'>Red Score</th>
                                    <th className='blue-team'>Blue Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matchListElements}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Grid>
        );
    }
};

const mapStateToProps = (state, props) => {
    return {
        activeMatch: state.matchInfo.activeMatch,
        matchList: state.matchInfo.matchList
    }
}

export default connect(mapStateToProps)(MatchList);