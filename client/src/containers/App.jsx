import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import MatchList from './MatchList';
import Admin from './Admin';
import MatchDisplay from './MatchDisplay';
import Rankings from './Rankings';
import ScoringPanel from './ScoringPanel'; 

import {addMatch} from '../actions/matchActions';

class App extends Component {
    constructor(props) {
        super(props);

        this.props.addMatch("Test", ["red1","red2"], ["blue1", "blue2"]);
        
    }
    render () {
        return(
            <Switch>
                <Route exact path="/" component={MatchList} />
                <Route exact path="/admin" component={Admin} />
                <Route exact path="/match" component={MatchDisplay} />
                <Route exact path="/rankings" component={Rankings} />
                <Route path="/scoring/:team" component={ScoringPanel} />
            </Switch>
        );
    }
};

const mapStateToProps = (state, ownProps) => {
    return {
        activeMatch: state.matchInfo.activeMatch,
        matchList: state.matchInfo.matchList
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        addMatch: (matchName, redTeams, blueTeams) => {
            dispatch(addMatch(matchName, redTeams, blueTeams));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);