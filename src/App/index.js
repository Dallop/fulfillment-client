import './style'
import React from 'react'
import { connect } from 'react-redux'
import cc from 'create-react-class'
import { Route, withRouter } from 'react-router-dom'
import { Flex, Box, settings } from 'boostly-ui'
import { getSettings } from './state'
import PrivateRoute from 'App/shared/PrivateRoute'
import { ManageOrders } from 'App/views'

const App = cc({
  componentDidMount () {
    this.props.dispatch(getSettings())
  },
  render () {
    return (
      <Box height='100%'>
        <Flex
          column
          m='0 auto'
          bg='lightBase'
          height='100%'
          position='relative'
        >
          <Route path='/login' component={require('./views').Login} />
          <PrivateRoute
            path='/:orgId/:locId'
            authorizedRoles={[ 'master', 'orgManager', 'locationManager' ]}
            component={props => <ManageOrders {...props} />}
          />
        </Flex>
      </Box>
    )
  }
})

export default withRouter(connect()(App))
