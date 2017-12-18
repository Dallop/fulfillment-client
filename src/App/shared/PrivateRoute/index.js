import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'
import cc from 'create-react-class'
import pt from 'prop-types'
import Loading from 'App/shared/Loading'
import { getMe, getAdminEntity } from 'App/state/session'

const PrivateRoute = cc({
  propTypes: { authorizedRoles: pt.array },
  userDataIsFetched () {
    return !this.props.session.isActive || this.props.user
  },
  componentDidMount () {
    const { session, getLoggedUserEntity } = this.props
    if (session.isActive) {
      getLoggedUserEntity(session.uid)
    }
  },
  isAuthorized ({ match }) {
    const { user } = this.props
    const { orgId, locId } = match.params
    if (!user) {
      return false
    } else if (user.roles.master) {
      return true
    } else if (user.roles.orgManager) {
      return orgId === user.org
    } else if (user.roles.locationManager) {
      return orgId === user.org &&
        user.locationPermissions.some(id => id === locId)
    }
  },
  render () {
    const { component: Component, ...rest } = this.props
    return (
      <Route
        {...rest}
        render={
          props =>
            this.userDataIsFetched()
              ? this.isAuthorized(props)
                ? <Component {...props} />
                : <Redirect
                  to={{ pathname: '/login', state: { from: props.location } }}
                />
              : <Loading />
        }
      />
    )
  }
})

const selector = (state, props) => ({
  user: getMe(state),
  session: state.session
})

const actions = dispatch => ({
  getLoggedUserEntity: uid => dispatch(getAdminEntity(uid))
})

export default connect(selector, actions)(PrivateRoute)
