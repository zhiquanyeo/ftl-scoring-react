import React, { Component } from 'react';
import { Table, Button } from 'react-bootstrap';

class TeamListView extends Component {
    render() {
        console.log(this.props);
        var teamList = this.props.teamList || {};

        var teamListElements;
        if (Object.keys(teamList).length === 0) {
            teamListElements = (<tr><td colSpan={3} style={{textAlign: "center"}}>No Teams Listed</td></tr>);
        }
        else {
            teamListElements = Object.keys(teamList).map((teamId) => {
                var teamName = teamList[teamId];
                return (
                    <tr key={teamId}>
                        <td>{teamId}</td>
                        <td>{teamName}</td>
                        <td>
                            <Button bsStyle="danger" bsSize="xsmall">Delete</Button>
                        </td>
                    </tr>
                )
            });
        }

        return (
            <Table responsive striped>
                <thead>
                    <tr>
                        <th>Team ID</th>
                        <th>Team Name</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {teamListElements}
                </tbody>
            </Table>
        )
    }
}

export default TeamListView;