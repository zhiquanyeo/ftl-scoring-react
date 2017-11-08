import React, { Component } from 'react';
import {
    BrowserRouter as Router
} from 'react-router-dom';

import App from '../App';

class AppRouter extends Component {
    componentWillMount() {

    }

    componentWillUnmount() {

    }

    render () {
        return (
            <Router>
                <App/>
            </Router>
        )
    }
};

export default AppRouter;