import { auth } from 'config/api'
import ls from './session.ls'
import { createAsyncActions as aa, createReducer } from 'state/utils'
import { callStore } from '../'

export const AUTH_ACTION_TYPES = aa('AUTH')
export const DESTROY_SESSION_ACTION_TYPES = aa('DESTROY_SESSION')

export const getAdminEntity = uid =>
  callStore({
    schema: { name: 'admins' },
    types: [ 'sync', 'success', 'fail' ],
    query: { collection: 'admins', doc: uid, method: 'onSnapshot' }
  })

export const getMe = ({ entities, session }) => entities.admins[session.uid]

export const login = (email, password) => dispatch => auth
  .signInWithEmailAndPassword(email, password)
  .then(user => {
    if (user) {
      const sessionData = { uid: user.uid, isActive: true }
      ls.create(sessionData)
      dispatch({ type: AUTH_ACTION_TYPES[1], payload: sessionData })
      dispatch(getAdminEntity(user.uid))
    } else {
      console.log('no user exists logging in')
    }
  })
  .catch(error => dispatch({ type: AUTH_ACTION_TYPES[2], payload: { error } }))

export const logout = () => dispatch => console.log('ho') || auth
    .signOut()
    .then(() => {
      ls.destroy()
      dispatch({ type: DESTROY_SESSION_ACTION_TYPES[1] })
    })
    .catch(error => console.log(error))

const sessionData = ls.retrieve() || { uid: '' }
const isActive = !!sessionData.uid
const initialSessionState = { ...sessionData, isActive }

const session = createReducer(initialSessionState, {
  [AUTH_ACTION_TYPES[1]]: (state, { payload: { uid } }) => ({
    uid,
    isActive: true,
    loginError: false
  }),
  [AUTH_ACTION_TYPES[2]]: (state, { payload }) => ({
    ...state,
    loginError: payload.error.message
  }),
  [DESTROY_SESSION_ACTION_TYPES[1]]: state => ({
    token: '',
    id: '',
    isActive: false,
    loginError: false
  })
})

export default { session }
