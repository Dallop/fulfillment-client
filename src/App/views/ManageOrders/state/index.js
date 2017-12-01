import { createAsyncActions as aa, createTimestamp } from 'state/utils'
import { callStore } from 'App/state'
import { makeEntityListReducer } from 'App/state/utils'
import { startOfDay } from 'date-fns'

const GET_LOCATION_ENTITY_ACTIONS = aa('GET_LOCATION_ENTITY')
export const getLocationEntity = ({ orgId, locId }) =>
  callStore({
    types: GET_LOCATION_ENTITY_ACTIONS,
    schema: { name: 'locations' },
    query: {
      collection: 'orgs',
      doc: orgId,
      subcollections: [ { collection: 'locations', doc: locId } ],
      method: 'onSnapshot'
    }
  })

const GET_NEW_ORDER_ENTITIES_ACTIONS = aa('GET_NEW_ORDER_ENTITIES')
export const getNewOrderEntities = ({ orgId, locId }) =>
  callStore({
    types: GET_NEW_ORDER_ENTITIES_ACTIONS,
    schema: { name: 'orders' },
    query: {
      collection: 'orders',
      where: [ 'status == awaitingApproval', `location == ${locId}` ],
      method: 'onSnapshot'
    },
    meta: { listKey: locId }
  })

const UPDATE_PREP_TIME_ACTIONS = aa('UPDATE_PREP_TIME')
export const updatePrepTime = ({ orgId, locId }) =>
  ({ time, duration }) =>
    callStore({
      types: UPDATE_PREP_TIME_ACTIONS,
      query: {
        collection: 'orgs',
        doc: orgId,
        subcollections: [ { collection: 'locations', doc: locId } ],
        method: 'update',
        data: {
          updatedPrepSettings: {
            startTime: createTimestamp(),
            time: Number(time),
            duration: Number(duration)
          }
        }
      }
    })

const GET_IN_PROGRESS_ORDER_ENTITIES_ACTIONS = aa(
  'GET_IN_PROGRESS_ORDER_ENTITIES'
)
const GET_FULFILLED_ORDER_ENTITIES_ACTIONS = aa('GET_FULFILLED_ORDER_ENTITIES')
export const getTodaysOrderEntities = ({ orgId, locId }) => dispatch => {
  dispatch(
    callStore({
      types: GET_IN_PROGRESS_ORDER_ENTITIES_ACTIONS,
      schema: { name: 'orders' },
      query: {
        collection: 'orders',
        where: [
          'status == inProgress',
          `location == ${locId}`,
          `createdAtUnix > ${startOfDay(new Date()).getTime()}`
        ],
        method: 'onSnapshot'
      },
      meta: { listKey: locId }
    })
  )
  dispatch(
    callStore({
      types: GET_FULFILLED_ORDER_ENTITIES_ACTIONS,
      schema: { name: 'orders' },
      query: {
        collection: 'orders',
        where: [
          'status == fulfilled',
          `location == ${locId}`,
          `createdAtUnix > ${startOfDay(new Date()).getTime()}`
        ],
        method: 'onSnapshot'
      },
      meta: { listKey: locId }
    })
  )
}

const GET_CONSUMER_ENTITY_ACTIONS = aa('GET_CONSUMER_ENTITY')
export const getConsumerEntity = id =>
  callStore({
    types: GET_CONSUMER_ENTITY_ACTIONS,
    schema: { name: 'consumers' },
    query: { collection: 'consumers', doc: id, method: 'get' },
    bailout: state => state.entities.consumers[id]
  })

const CHANGE_ORDER_STATUS_ACTIONS = aa('CHANGE_ORDER_STATUS')
export const changeOrderStatus = (id, status) =>
  callStore({
    types: CHANGE_ORDER_STATUS_ACTIONS,
    query: { collection: 'orders', doc: id, method: 'update', data: { status } }
  })

const selectOrderEntities = type =>
  ({ locId }) =>
    ({ entities, ...rest }) => (rest[type][locId] || []).map(id => {
      const order = entities.orders[id]
      return {
        ...order,
        consumer: entities.consumers[order.consumer] || order.consumer
      }
    })
const selectInProgress = selectOrderEntities('inProgressOrders')
const selectFulfilled = selectOrderEntities('fulfilledOrders')
export const selectors = {
  getLocationDetails: ({ locId }) =>
    ({ entities }) => entities.locations[locId] || {},
  getNewOrders: selectOrderEntities('newOrders'),
  getOrders: params =>
    state => [
      ...selectInProgress(params)(state),
      ...selectFulfilled(params)(state)
    ]
}

export default {
  newOrders: makeEntityListReducer({
    listName: 'newOrders',
    actionType: GET_NEW_ORDER_ENTITIES_ACTIONS[1]
  }),
  inProgressOrders: makeEntityListReducer({
    listName: 'inProgressOrders',
    actionType: GET_IN_PROGRESS_ORDER_ENTITIES_ACTIONS[1]
  }),
  fulfilledOrders: makeEntityListReducer({
    listName: 'fulfilledOrders',
    actionType: GET_FULFILLED_ORDER_ENTITIES_ACTIONS[1]
  })
}
