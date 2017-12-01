import React from 'react'
import { connect } from 'react-redux'
import pt from 'prop-types'
import cc from 'create-react-class'
import {
  Flex,
  Box,
  Button,
  Text,
  Title,
  Input,
  settings as s
} from 'boostly-ui'
import { login, getMe } from 'App/state/session'

const Label = ({ label, children }) => (
  <Flex pr={2} pb={1} align='center'>
    <Text>{label || children}</Text>
  </Flex>
)
const InputField = ({ ...rest, label, inputRef, width = '100%' }) => (
  <Flex column py={1} w={width}>
    <Label label={label} />
    <Box>
      <Input {...rest} />
    </Box>
  </Flex>
)
const Login = cc({
  propTypes: { admin: pt.object },
  getInitialState () {
    return { email: '', password: '' }
  },
  onValueChange (key) {
    return ({ target }) => this.setState(prev => ({ [key]: target.value }))
  },
  componentDidMount () {
    this.maybeRedirect(this.props.admin)
  },
  componentWillReceiveProps ({ admin }) {
    this.maybeRedirect(admin)
  },
  maybeRedirect (admin) {
    if (admin) {
      if (admin.roles.locationManager) {
        this.props.history.push({
          pathname: `/${admin.org}/${admin.locationPermissions[0]}`
        })
      }
    }
  },
  onSubmit (e) {
    e.preventDefault()
    this.props.dispatch(login(this.state.email, this.state.password))
  },
  render () {
    return (
      <Box height='100%'>
        <Box
          paddingTop='15%'
          is='form'
          onSubmit={this.onSubmit}
          w='100%'
          maxWidth='320px'
          margin='0 auto'
          p={1}
        >
          <Box pb={1}>
            <Title fontSize={5}>Hey There!</Title>
          </Box>
          <InputField
            label='Email'
            value={this.state.email}
            onChange={this.onValueChange('email')}
          />
          <InputField
            label='Password'
            type='Password'
            value={this.state.password}
            onChange={this.onValueChange('password')}
          />
          <Box pt={2}>
            <Button>Login</Button>
          </Box>
          <Box p={2}>
            {this.props.loginError && (
            <Box is='span' color={s.colors.primaryCta} textAlign='center'>
              {this.props.loginError}
            </Box>
                )}
          </Box>
        </Box>
      </Box>
    )
  }
})

export default connect(state => ({
  admin: getMe(state),
  loginError: state.session.loginError
}))(Login)
