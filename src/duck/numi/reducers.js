import { handleActions } from 'redux-actions';
import * as types from './types';

const numiReducer = handleActions({
        [types.COUNT_EXP]:
            (state, action) => ({
                ...state,
                data: action.payload,
            }),
    },
    {
        error: false,
        data: null,
    });


export default numiReducer;