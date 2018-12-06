import { handleActions } from 'redux-actions';
import * as types from './types';

const numiReducer = handleActions({
        [types.COUNT_EXP]:
            (state, action) => {
            const actionExp = action.payload.exp;
            const storedData = JSON.parse(localStorage.getItem("fixerData"))[0];
            // console.log(storedData);
            const variables = Object.keys(storedData).join("|");
            let expression = actionExp.toUpperCase().replace(new RegExp(variables, "g"), (key) => "*" +storedData[key]);
            expression = expression.replace(/(?!-)[^0-9.,+%*/()]/g, "");
            console.log(actionExp, " AFTER REPLACE: ", expression);

            let newState = {...state, error: false, data: actionExp};
            try {
                const result = expression ? eval(expression) : '';
                newState["result"] = result;
            } catch (e) {
                newState["error"] = true;
                newState["result"] = '';
            }
            return newState},
    },
    {
        error: false,
        result: null,
        data: null
    });


export default numiReducer;