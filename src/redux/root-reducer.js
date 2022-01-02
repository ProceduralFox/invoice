import { combineReducers } from 'redux';
import dataReducer from './data/data.reducer';
import modeReducer from './mode/mode.reducer';



export default combineReducers({
    mode: modeReducer,
    data: dataReducer
}) 
