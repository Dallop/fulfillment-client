import { createReducer } from 'state/utils'

export const makeEntityListReducer = ({ actionType }) =>
  createReducer({}, {
    [actionType]: (state, { payload, meta }) => ({
      ...state,
      [meta.listKey]: payload.ids
    })
  })
