import React, { Component } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'

import './App.css';

import MatchList from './containers/MatchList';
import Admin from './containers/Admin';
import MatchDisplay from './containers/MatchDisplay';
import Rankings from './containers/Rankings';
import ScoringPanel from './containers/ScoringPanel';

class App extends Component {
    render () {
        var matchList = [
            {
                matchName: 'Q1',
                redTeams: ['red 1', 'red 2'],
                blueTeams: ['janky mcipswitch', 'robot mcbotface'],
                scores: {
                    red: {
                        auto: 0,
                        teleop: 0,
                        others: 0,
                        fouls: 0,
                        techFouls: 0
                    },
                    blue: {
                        auto: 0,
                        teleop: 0,
                        others: 0,
                        fouls: 0,
                        techFouls: 0
                    }
                },
                state: 'PRE_START'
            }
        ];
        return(
            <div className="container-fluid">
                <Router>
                    <Switch>
                        <Route exact path="/" render={(props) => (<MatchList {...props} matchList={matchList}/>)} />
                        <Route exact path="/admin" component={Admin} />
                        <Route exact path="/match" component={MatchDisplay} />
                        <Route exact path="/rankings" component={Rankings} />
                        <Route path="/scoring/:team" component={ScoringPanel} />
                    </Switch>
                </Router>
            </div>
        );
    }
};

export default App;