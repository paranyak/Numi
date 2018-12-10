import { handleActions } from 'redux-actions';
import * as types from './types';

const numiReducer = handleActions(
    {
        [types.COUNT_EXP]: (state, action) => {
            const actionExp = action.payload.exp;
            let expression = actionExp;
            let variableIndex = action.payload.variableIndex;
            let differenceIndex = action.payload.ind;
            if (variableIndex) expression = actionExp.slice(variableIndex + 1);
            // data from Fixer
            if (localStorage.getItem('fixerData')) {
                const storedData = JSON.parse(
                    localStorage.getItem('fixerData')
                )[0];
                const variables = Object.keys(storedData).join('|');
                expression = expression
                    .toUpperCase()
                    .replace(
                        new RegExp(variables, 'g'),
                        key => '*' + storedData[key]
                    );
            }
            //local variables
            const localVariables = Object.keys(state.localVars).join('|');
            if (localVariables) {
                expression = expression
                    .toLowerCase()
                    .replace(
                        new RegExp(localVariables, 'g'),
                        key => state.localVars[key]
                    );
            }
            // local operators
            const localOperators = Object.values(state.localOperators);
            localOperators.map((operatorArray, i) => {
                operatorArray.map(operator => {
                    if (expression.toLowerCase().indexOf(operator) !== -1) {
                        expression = expression
                            .toLowerCase()
                            .replace(
                                operator,
                                Object.keys(state.localOperators)[i]
                            );
                    }
                });
            });

            let newState = {
                ...state,
                error: false,
            };
            let result = [...state.result];
            result[differenceIndex] = '';
            console.log('IN COUNT EXP', expression);

            try {
                const resultExp = expression ? eval(expression) : '';
                result[differenceIndex] = resultExp;
                newState['result'] = result;
            } catch (e) {
                newState['error'] = true;
            }
            newState['result'] = result;

            return newState;
        },

        [types.SAVE_EXP]: (state, action) => {
            let result = [...state.result];
            result.push('');
            let newState = { ...state, result: result };
            return newState;
        },

        [types.DELETE_EXP]: (state, action) => {
            let deletedIndex = action.payload.ind;
            console.log("DELETED IND: ", deletedIndex);
            let result = [...state.result];
            result.splice(deletedIndex, 1);
            console.log("DELETE: ", result);
            let newState = { ...state, result: result };
            return newState;
        },

        [types.COUNT_TOTAL]: (state, action) => {
            let differenceIndex = action.payload.ind;
            let result = state.result.slice(0, differenceIndex);
            let total_result = result.reduce(
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
