import { createActions } from 'redux-actions'
import * as types from './types'

const numiActions = createActions({
    [types.COUNT_EXP]: exp => ({ exp }),
    [types.SAVE_EXP]: exp => ({ exp }),
    [types.COUNT_TOTAL]: exp => ({ exp }),
    [types.CREATE_VAR]: variable => ({ variable }),
})

export default numiActions
