import React, { Component } from 'react';
import { Table, Button, ButtonToolbar, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';

import {setActiveMatch, deleteMatch} from '../actions/matchActions';

class MatchAdminList extends Component {
    onActivateEvent(matchName, e) {
        console.log('handleActivateMatch');
        this.props.handleActivateMatch(matchName);
    }

    onDeleteEvent(matchName) {
        this.props.handleDeleteMatch(matchName);
    }

    render() {
        var matchList = this.props.matchList || [];
        var matchListElements;

        var canActivate = !this.props.activeMatch;

        if (matchList.length === 0) {
            matchListElements = (<tr><td colSpan="8" style={{textAlign: "center"}}>No Matches Listed</td></tr>);
        }
        else {
            matchListElements = matchList.map((matchInfo) => {
                var activeClassName = (matchInfo.matchName === this.props.activeMatch) ? "active-match" : null;
                var btnDisabled = !canActivate && matchInfo.state !== 'PRE_START';
                var deleteBtnDisabled = matchInfo.state !== 'PRE_START' || matchInfo.matchName === this.props.activeMatch;

                // Always allow deletions
                deleteBtnDisabled = false;

                return (
                    <tr key={matchInfo.matchName} className={activeClassName}>
                        <td>{matchInfo.matchName}</td>
                        <td>{matchInfo.state}</td>
                        <td className="red-team">{matchInfo.redTeams[0] || 'EMPTY'}</td>
                        <td className="red-team">{matchInfo.redTeams[1] || 'EMPTY'}</td>
                        <td className="blue-team">{matchInfo.blueTeams[0] || 'EMPTY'}</td>
                        <td className="blue-team">{matchInfo.blueTeams[1] || 'EMPTY'}</td>
                        <td><Glyphicon glyph={matchInfo.shouldScore ? 'ok':'remove'}/></td>
                        <td>
                            <ButtonToolbar>
                                <Button onClick={(e) => {this.onDeleteEvent(matchInfo.matchName)}} disabled={deleteBtnDisabled} bsStyle="danger" bsSize="xsmall">Delete</Button>
                                <Button disabled={btnDisabled} bsStyle="success" bsSize="xsmall" onClick={(e) => this.onActivateEvent(matchInfo.matchName)}>Activate</Button>
                            </ButtonToolbar>
                        </td>
                    </tr>
                )
            })
        }

        return (
            <Table responsive striped>
                <thead>
                    <tr>
                        <th>Match</th>
                        <th>State</th>
                        <th colSpan={2} className='red-team'>Red Teams</th>
                        <th colSpan={2} className='blue-team'>Blue Teams</th>
                        <th>Scored</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {matchListElements}
                </tbody>
            </Table>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        activeMatch: state.matchInfo.activeMatch,
        matchList: state.matchInfo.matchList
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        handleActivateMatch: (matchName) => {
            dispatch(setActiveMatch(matchName));
        },
        handleDeleteMatch: (matchName) => {
            dispatch(deleteMatch(matchName));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchAdminList);
