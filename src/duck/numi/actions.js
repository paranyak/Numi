import { createActions } from 'redux-actions';
import * as types from './types';

const numiActions = createActions({
    [types.COUNT_EXP]: (res, ind) => ({ res, ind }),
    [types.SAVE_EXP]: exp => ({ exp }),
    [types.COUNT_TOTAL]: ind => ({ ind }),
    [types.CREATE_VAR]: (variable, ind) => ({ variable, ind }),
    [types.DELETE_EXP]: ind => ({ ind }),
});

export default numiActions;
