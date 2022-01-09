import { applyMiddleware, createStore } from "redux";
import logger from "redux-logger";

import rootReducer from './root-reducer';

let middlewares = []
if(process.env.NODE_ENV === 'development'){
    middlewares = [logger];
}


export const store = createStore(rootReducer, applyMiddleware(...middlewares));

export default store;