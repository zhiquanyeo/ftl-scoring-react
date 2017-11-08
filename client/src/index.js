import React from 'react';
import ReactDOM from 'react-dom';
import './resources/css/bootstrap.min.css';
import './index.css';
import './App.css';

import Root from './containers/Root/Root'

import configureStore from './store/configureStore';

const store = configureStore();

ReactDOM.render(<Root store={store} />, document.getElementById('root'));