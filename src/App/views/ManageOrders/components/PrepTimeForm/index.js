import React from 'react'
import cc from 'create-react-class'
import pt from 'prop-types'
import { Box, Title, Select, Button } from 'boostly-ui'
import { settingsAreActive } from './utils'

const PrepTimeForm = cc({
  propTypes: {
    currentPrepSettings: pt.shape({
      startTime: pt.object,
      time: pt.number,
      duration: pt.number
    })
  },
  getInitialState () {
    return this.setDefaults(this.props.currentPrepSettings)
  },
  componentWillReceiveProps (next) {
    this.setState(prev => this.setDefaults(next.currentPrepSettings))
  },
  setDefaults (settings) {
    const isActive = settingsAreActive(settings)
    return {
      time: isActive ? settings.time : 15,
      duration: isActive ? settings.duration : 1
    }
  },
  update (key) {
    return ({ target }) => this.setState(prev => ({ [key]: target.value }))
  },
  render () {
    return (
      <Box
        p={2}
        is='form'
        onSubmit={e => {
          e.preventDefault()
          this.props.onSubmit(this.state)
        }}
      >
        <Box maxWidth='300px'>
          How much time should we tell the consumer to expect before their order will be ready?
        </Box>
        <Box pb={1} mt={2}>
          <Title>Time:</Title>
        </Box>
        <Select value={this.state.time} onChange={this.update('time')}>
          {
            [ 15, 20, 30, 45, 60 ].map((amount, i) => (
              <option value={amount} key={amount}>{amount} Min</option>
            ))
          }
        </Select>
        <Box pb={1} mt={2}>
          <Title>Duration:</Title>
        </Box>
        <Select value={this.state.duration} onChange={this.update('duration')}>
          {[ 1, 1.5, 2, 2.5, 3 ].map((amount, i) => (
            <option value={amount} key={amount}>
              {amount} {amount > 1 ? 'Hours' : 'Hour'}
            </option>
            ))}
        </Select>
        <Box mt={2}>
          <Button type='submit'>Save</Button>
        </Box>
      </Box>
    )
  }
})

export default PrepTimeForm
