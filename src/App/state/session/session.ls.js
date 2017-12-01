import store from 'store'

const KEY = 'boostly-session'
const warning = 'attempted to create a session with no'

export default { create, destroy, update, retrieve }

function create (session) {
  if (!session.uid) console.warn(`${warning} uid`)

  store.set(KEY, session)

  return session
}

function destroy () {
  store.remove(KEY)
  return retrieve()
}

function update (session) {
  return create(session)
}

/**
 * @desc returns session data from local store
 * @return {Object} Session
 */
function retrieve () {
  return store.get(KEY) || undefined
}
