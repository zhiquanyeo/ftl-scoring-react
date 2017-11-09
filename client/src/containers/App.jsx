import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import MatchList from './MatchList';
import Admin from './Admin';
import MatchDisplay from './MatchDisplay';
import Rankings from './Rankings';
import ScoringPanel from './ScoringPanel'; 

class App extends Component {
    constructor(props) {
        super(props);
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

export default connect(mapStateToProps)(App);