import React from 'react'
import { storiesOf } from '@storybook/react'
import OrderListing from './index'

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
  consumer: {
    email: 'john@doe.com',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '8055018930'
  },
  createdAt: 'Sun Nov 19 2017 10:24:15 GMT-0700 (MST)',
  status: 'awaitingApproval',
  cost: { total: 25.5, subtotal: 24, tax: 1.5 },
  method: { type: 'PICK_UP', label: 'Pick Up' }
}

storiesOf('Collapse', module).add('basic', () => (
  <div>
    <OrderListing expanded details={{ ...base, items: [ item ] }} />
  </div>
)).add('option sets', () => (
  <div>
    <OrderListing
      expanded
      details={{ ...base, items: [ { ...item, id: '321', selectionSets } ] }}
    />
  </div>
)).add('multiple', () => (
  <div>
    <OrderListing
      expanded
      details={{
        ...base,
        items: [
            { ...item, id: '456' },
            { ...item, id: '321', selectionSets },
          item
        ]
      }}
    />
  </div>
)).add('complex set', () => (
  <div>
    <OrderListing
      expanded
      details={{
        ...base,
        items: [
            { ...item, id: '456' },
          {
            ...item,
            id: '321',
            selectionSets: [ ...selectionSets, selectionSet2 ]
          }
        ]
      }}
    />
  </div>
))
