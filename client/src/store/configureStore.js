import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import apiActionEmitter from '../api/apiActionEmitter';
import applyActionEmitters from './applyActionEmitters';

import rootReducer from '../reducers';

export default function configureStore() {
    const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
    applyActionEmitters(store)(
        apiActionEmitter
    );
    
    return store;
}