import {handleActions} from 'redux-actions';
import * as types from './types';

const numiReducer = handleActions({
        [types.COUNT_EXP]:
            (state, action) => {
                const actionExp = action.payload.exp;
                let expression = actionExp;
                if (localStorage.getItem("fixerData")) {
                    const storedData = JSON.parse(localStorage.getItem("fixerData"))[0];
                    const variables = Object.keys(storedData).join("|");
                    expression = expression.toUpperCase().replace(new RegExp(variables, "g"), (key) => "*" + storedData[key]);
                }
                const localVariables = Object.keys(state.localVars).join("|");
                if (localVariables) {
                    console.log("LOCAL VAR", localVariables);
                    expression = expression.toLowerCase().replace(new RegExp(localVariables, "g"), (key) => "*" + state.localVars[key]);
                    console.log("EXP AFTER LOCAL:", expression);
                }
                expression = expression.replace(/(?!-)[^0-9.,+%*/()]/g, "");

                let newState = {...state, error: false, data: {exp: actionExp, resultingExp: expression}};
                let result = [...state.result];
                result[result.length - 1] = "";

                try {
                    const resultExp = expression ? eval(expression) : '';
                    result[result.length - 1] = resultExp;
                    newState["result"] = result;
                } catch (e) {
                    newState["error"] = true;
                }
                newState["result"] = result;

                return newState
            },

        [types.SAVE_EXP]:
            (state, action) => {
                let result = [...state.result];
                result.push("");
                let newState = {...state, result: result};
                return newState;
            },

        [types.COUNT_TOTAL]:
            (state, action) => {
                let result = state.result.slice(0, state.result.length - 1);
                let total_result = result.reduce((sum, current) => sum + current, 0);
                result.push(total_result);
                let newState = {...state, result: result};
                return newState;
            },

        [types.CREATE_VAR]:
            (state, action) => {
                let variable = action.payload.variable.toLowerCase();
                let localVars = {...state.localVars};
                localVars[variable] = state.result[state.result.length - 1];
                console.log("CREATE VAR:", localVars);
                let newState = {...state, localVars};
                return newState;
            }
    },
    {
        error: false,
        result: [""],
        data: null,
        allExp: [],
        localVars: {},
    });


export default numiReducer;