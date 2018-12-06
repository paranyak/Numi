import { handleActions } from 'redux-actions';
import * as types from './types';

const numiReducer = handleActions({
        [types.COUNT_EXP]:
            (state, action) => {
            const result = eval(action.payload.exp);
            console.log("result", result);
                return {
                ...state,
                result,
                error: true
            }},
    },
    {
        error: false,
        result: null,
    });


export default numiReducer;