import React from 'react'
import Dom from 'react-dom'
import cc from 'create-react-class'
import { HashRouter } from 'react-router-dom'
import { Provider, connect } from 'react-redux'
import { configureStore } from 'state'
import App from 'App'
import { Box, Button } from 'boostly-ui'
import { callStore } from 'App/state'
import { createAsyncActions as aa } from 'state/utils'

const selectionSets = [
  {
    name: 'Toppings',
    optionsAreDefaults: false,
    selections: [
      { name: 'Hot Sauce', cost: '0' },
      { name: 'Jalapenos', cost: '1' }
    ]
  }
]

const selectionSet2 = {
  name: 'Defaults',
  optionsAreDefaults: true,
  selections: [ { name: 'Burning Fire Sauce', cost: '0' } ]
}

const item = {
  id: '123',
  name: 'Tacos',
  servingPortion: { name: 'Regular', price: '5.99' },
  quantity: 2,
  instructions: '',
  description: 'Super delicious of your dreams'
}

const base = {
  consumer: 'KjgMTqqmyBPAg1T0n7c7',
  org: 'DNXpc3V91meNACbhMGBh',
  location: 'thE5G85ID5LL9AoVXFzr',
  createdAt: 'Sun Nov 19 2017 10:24:15 GMT-0700 (MST)',
  status: 'awaitingApproval',
  cost: { total: 25.5, subtotal: 24, tax: 1.5 },
  method: { type: 'PICK_UP', label: 'Pick Up' }
}

const newOrder = { ...base, items: [ { ...item, id: '321', selectionSets } ] }
const ControlPanel = connect()(
  cc({
    getInitialState () {
      return { isOpen: false }
    },
    createNew () {
      const time = new Date()
      this.props.dispatch(
        callStore({
          types: aa('GOD_MODE_CREATE_NEW_ORDER'),
          query: {
            data: {
              ...newOrder,
              createdAt: time,
              createdAtUnix: time.getTime()
            },
            collection: 'orders',
            method: 'add'
          }
        })
      )
      console.log('calling')
    },
    render () {
      const { isOpen } = this.state
      return (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: '20px',
            backgroundColor: isOpen
                ? 'rgba(255,255,255,.15)'
                : 'rgba(255,255,255,.15)',
            paddingTop: '40px',
            paddingBottom: '20px',
            zIndex: 200,
            height: isOpen ? 'auto' : '50px',
            boxShadow: '6px 3px 25px -1px rgba(0,0,0,0.75)'
          }}
        >
          <div
            onClick={() => this.setState({ isOpen: !this.state.isOpen })}
            style={{
              cursor: 'pointer',
              padding: '10px',
              fontSize: '2em',
              position: 'absolute',
              top: 0,
              right: 0
            }}
          >
            {isOpen ? '\uD83D\uDC4E' : '\uD83D\uDC4D'}
          </div>
          <Box p={2} w='300px'>
            <Button onClick={this.createNew}>Create New Order</Button>
          </Box>
        </div>
      )
    }
  })
)

const store = configureStore()
const root = document.getElementById('root')

const Root = () => (
  <Provider {...{ store, key: 'provider' }}>
    <HashRouter>
      <Box height='100%'>
        <App />
        <ControlPanel />
      </Box>
    </HashRouter>
  </Provider>
)

Dom.render(<Root />, root)
