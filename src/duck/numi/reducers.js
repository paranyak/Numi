import { handleActions } from 'redux-actions';
import * as types from './types';

const numiReducer = handleActions({
        [types.COUNT_EXP]:
            (state, action) => {
            let newState = {...state, error: false};
            try {
                let result = eval(action.payload.exp);
                newState["result"] = result;
                console.log("result", result);
            } catch (e) {
                newState["error"] = true;
            }
            return newState},
    },
    {
        error: false,
        result: null,
    });


export default numiReducer;