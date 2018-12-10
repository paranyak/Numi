import { combineReducers } from 'redux';
import reducer from './duck/numi/reducers';

const rootReducer = combineReducers({
    calculator: reducer,
});

export default rootReducer;
