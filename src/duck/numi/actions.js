import { createActions } from 'redux-actions';
import * as types from './types';

const numiActions = createActions(
    {
        [types.COUNT_EXP]: (exp) => ({ exp }),

    },
);

export default  numiActions;