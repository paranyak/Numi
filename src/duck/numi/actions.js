import { createActions } from 'redux-actions';
import * as types from './types';

const numiActions = createActions({
    [types.COUNT_EXP]: (exp, ind, variableIndex) => ({
        exp,
        ind,
        variableIndex,
    }),
    [types.SAVE_EXP]: exp => ({ exp }),
    [types.COUNT_TOTAL]: ind => ({ ind }),
    [types.CREATE_VAR]: (variable, ind) => ({ variable, ind }),
});

export default numiActions;
