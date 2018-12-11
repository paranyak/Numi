import { handleActions } from 'redux-actions';
import * as types from './types';

const numiReducer = handleActions(
    {
        [types.COUNT_EXP]: (state, action) => {
            const error = action.payload.res.error;
            const resultExp = action.payload.res.result;
            const differenceIndex = action.payload.ind;
            let result = [...state.result];
            result[differenceIndex] = resultExp;
            let newState = {
                ...state,
                error,
                result,
            };
            return newState;
        },

        [types.SAVE_EXP]: state => {
            let result = [...state.result];
            result.push('');
            let newState = { ...state, result: result };
            return newState;
        },

        [types.DELETE_EXP]: (state, action) => {
            let deletedIndex = action.payload.ind;
            let result = [...state.result];
            result.splice(deletedIndex, 1);
            let newState = { ...state, result: result };
            return newState;
        },

        [types.COUNT_TOTAL]: (state, action) => {
            let differenceIndex = action.payload.ind;
            let expForTotal = state.result.slice(0, differenceIndex);
            let result = [...state.result];
            let total_result = expForTotal.reduce(
                (sum, current) => sum + current,
                0
            );
            result[differenceIndex] = total_result;
            let newState = { ...state, result: result };
            return newState;
        },

        [types.CREATE_VAR]: (state, action) => {
            let variable = action.payload.variable.toLowerCase();
            let localVars = { ...state.localVars };
            let differenceIndex = action.payload.ind;
            localVars[variable] = state.result[differenceIndex];
            let newState = { ...state, localVars };
            return newState;
        },
    },
    {
        error: false,
        result: [''],
        localVars: {},
        localOperators: {
            '+': ['plus', 'and', 'with', 'add'],
            '-': ['minus', 'subtract', 'without'],
            '*': ['times', 'multiplied by', 'mul'],
            '/': ['divide by', 'divide'],
            '/100 *': ['% of'],
        },
    }
);

export default numiReducer;
