import { combineReducers } from 'redux'
import { createAsyncActions as aa } from 'state/utils'
export const callStore = require('config/api').callStore
const entityNames = [
  'admins',
  'orders',
  'consumers',
  'orderMethods',
  'orderTiming',
  'locations'
]

const initialEntityState = entityNames.reduce(
  (state, entity) => ({ ...state, [entity]: {} }),
  {}
)

const createReducerFn = name =>
  (state = initialEntityState[name], { payload }) =>
    payload && payload.entities && payload.entities[name]
      ? { ...state, ...payload.entities[name] }
      : state

const entities = combineReducers(
  entityNames.reduce(
    (state, entity) => ({ ...state, [entity]: createReducerFn(entity) }),
    {}
  )
)

const GET_SETTINGS_ACTIONS = aa('GET_SETTINGS')
const settings = [ 'orderMethods', 'orderTiming' ]
export const getSettings = () => dispatch => {
  settings.forEach(
    s =>
      dispatch(
        callStore({
          types: GET_SETTINGS_ACTIONS,
          schema: { name: s },
          query: {
            collection: 'settings',
            doc: 'primary',
            method: 'get',
            subcollections: [ { collection: s } ]
          }
        })
      )
  )
}

export default combineReducers({
  entities,
  ...require('./session').default,
  ...require('App/views/ManageOrders/state').default
})
