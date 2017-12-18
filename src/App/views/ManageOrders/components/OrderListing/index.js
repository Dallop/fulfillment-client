import React from 'react'
import cc from 'create-react-class'
import pt from 'prop-types'
import { format, differenceInSeconds, addMinutes } from 'date-fns'
import { Flex, Box, Text, Title, settings as s } from 'boostly-ui'
import { toPrice, formatPhone, pad } from 'utils/rendering'
import { Div } from 'glamorous'
import CaretIcon from 'App/shared/CaretIcon'

const CollapseHead = ({ isOpen, onToggle, children }) => (
  <Box
    bg={s.colors.base}
    cursor='pointer'
    transition='.2s'
    pr={2}
    onClick={onToggle}
    border={`solid 1px ${s.colors.baseBorder}`}
  >
    <Flex justify='space-between' align='center'>
      <Box>
        {children}
      </Box>
      <Box>
        <CaretIcon direction={isOpen ? 'down' : 'right'} />
      </Box>
    </Flex>
  </Box>
)

const CollapseBody = ({ isOpen, children }) => (
  <Box
    maxHeight={isOpen ? '1000px' : 0}
    overflow='hidden'
    transition='.25s ease'
  >
    {children}
  </Box>
)

const Collapse = cc({
  propTypes: { children: pt.func },
  getInitialState () {
    return { open: this.props.open || false }
  },
  toggleOpen () {
    this.setState(() => ({ open: !this.state.open }))
  },
  render () {
    const { open } = this.state
    const { children } = this.props
    return (
      <Box width='100%'>
        {
          children({
            isOpen: open,
            onToggle: this.toggleOpen,
            CollapseHead,
            CollapseBody
          })
        }
      </Box>
    )
  }
})
const OrderInstructions = ({ copy }) => (
  <Text is='p' fontSize='12px' fontStyle='italic' pr={4} pt={'4px'}>
    <span style={{ fontWeight: 'bold' }}>
      Instructions:
    </span>{' '}
    {copy}
  </Text>
)
/**
 * 1. 15px, 16px ml box is same as CloseAction to ensure alignment
 * it's ugly and not very DRY but it works
 */
const SelectionLineItem = ({ name, cost, inverted }) => (
  <Flex justify='space-between'>
    <Text fontSize='12px'>
      {inverted ? <Title>
        <Box is='span' color={s.colors.primaryCta}>No</Box> {' '}
      </Title> : ''}
      {name}
    </Text>
    <Flex>
      <Text fontSize='12px'>
        {inverted ? '' : cost ? toPrice(cost) : ''}
      </Text>
    </Flex>
  </Flex>
)

const OrderListing = cc({
  propTypes: {
    details: pt.shape({
      fulfillBy: pt.oneOfType([ pt.string, pt.object ]),
      status: pt.string,
      consumer: pt.object,
      createdAt: pt.oneOfType([ pt.string, pt.object ]),
      cost: pt.shape({
        total: pt.oneOfType([ pt.string, pt.number ]),
        subtotal: pt.oneOfType([ pt.string, pt.number ]),
        tax: pt.oneOfType([ pt.string, pt.number ])
      })
    })
  },
  statusToLabel: {
    awaitingApproval: 'Awaiting Approval',
    inProgress: 'In Progress',
    fulfilled: 'Fulfilled'
  },
  testDate: new Date(),
  renderHeader ({ status, cost, method, consumer, createdAt, fulfillBy }) {
    return (
      <Flex>
        <Flex column align='center' justify='center' w='100px'>
          <Title>{method.label}</Title>
          <Text>{toPrice(cost.total)}</Text>
          <Countdown until={fulfillBy} />
        </Flex>
        <Box border={`solid 1px ${s.colors.baseHighlight}`} />
        <Flex column justify='center' pl={2} py={1}>
          <Title>{consumer.firstName} {consumer.lastName}</Title>
          <Title>
            <Text>Status:{' '}</Text>
            <Box
              is='span'
              color={
                status === 'fulfilled' ? s.colors.success : s.colors.primaryCta
              }
            >
              {this.statusToLabel[status]}
            </Box>
          </Title>
          <Text>
            Submitted:{' '}
            <Title>
              {format(new Date(createdAt), 'hh:mm A')}
            </Title>
          </Text>
          <Text>
            Phone:{' '}
            <Title>
              {formatPhone(consumer.phoneNumber)}
            </Title>
          </Text>
        </Flex>
      </Flex>
    )
  },
  renderItems (items) {
    return items.map((item, i) => (
      <Div
        display='flex'
        key={item.id}
        backgroundColor={s.colors.lightBaseHighlight}
        border={`solid 1px ${s.colors.base}`}
      >
        <Flex w='100px' py={2} justify='center'>
          {item.quantity}
        </Flex>
        <Box border={`solid 1px ${s.colors.baseHighlight}`} />
        <Flex column flexGrow={1} px={2} py={1}>
          <Flex justify='space-between' flexGrow={1}>
            <Flex column>
              <Title>{item.name}</Title>
              <Text>{item.servingPortion.name}</Text>
            </Flex>
            <Flex column justify='flex-end'>
              {toPrice(item.servingPortion.price)}
            </Flex>
          </Flex>
          <Flex width='100%' column>
            {(item.selectionSets || []).map(
                (set, id) => set.selections.length ? <Box key={set.id} pt='2px'>
                  <Title fontSize='12px' fontStyle='italic'>
                    {set.name}
                  </Title>
                  <Box pt={'2px'}>
                    {set.selections.map((sel, i) => (
                      <Box key={i} pt='2px'>
                        <SelectionLineItem
                          {...sel}
                          inverted={set.optionsAreDefaults}
                            />
                      </Box>
                        ))}
                  </Box>
                </Box> : undefined
              )}
            {
              item.instructions &&
                <OrderInstructions copy={item.instructions} />
            }
          </Flex>
        </Flex>
      </Div>
    ))
  },
  render () {
    const { details, expanded } = this.props
    return (
      <Collapse open={expanded}>
        {({ CollapseHead, CollapseBody, ...props }) => (
          <Box>
            <CollapseHead {...props}>
              {this.renderHeader(details)}
            </CollapseHead>
            <CollapseBody {...props}>
              <Box my={1}>
                {this.renderItems(details.items)}
              </Box>
              <Flex
                mb={1}
                bg={s.colors.lightBaseHighlight}
                border={`solid 1px ${s.colors.base}`}
                >
                <Box w='100px' />
                <Box border={`solid 1px ${s.colors.base}`} />
                <Box flexGrow={1}>
                  <Flex justify='space-between' py='4px' px={2}>
                    <Text>Subtotal</Text>
                    <Text>{toPrice(details.cost.subtotal)}</Text>
                  </Flex>
                  <Flex justify='space-between' py='4px' px={2}>
                    <Text>Sales Tax</Text>
                    <Text>{toPrice(details.cost.tax)}</Text>
                  </Flex>
                  <Flex bg={s.colors.success}>
                    <Flex justify='space-between' flexGrow={1} px={2} py={1}>
                      <Title>Total</Title>
                      <Title>{toPrice(details.cost.total)}</Title>
                    </Flex>
                  </Flex>
                </Box>
              </Flex>
            </CollapseBody>
          </Box>
          )}
      </Collapse>
    )
  }
})

export default OrderListing

const Countdown = cc({
  countdown: null,
  propTypes: { until: pt.object },
  getInitialState () {
    return { secondsLeft: differenceInSeconds(this.props.until, new Date()) }
  },
  componentDidMount () {
    this.updateTime()
  },
  componentWillUnmount () {
    window.clearTimeout(this.countdown)
  },
  updateTime () {
    const secondsLeft = differenceInSeconds(this.props.until, new Date())
    if (secondsLeft <= 0) {
      this.setState(prev => ({ secondsLeft: 0 }))
    } else {
      this.setState(prev => ({ secondsLeft }))
      this.countdown = window.setTimeout(this.updateTime, 1000)
    }
  },
  format (secondsLeft) {
    const hours = Math.floor(secondsLeft / 3600)
    const minutes = pad(Math.floor(secondsLeft % 3600 / 60), 2)
    const seconds = pad(secondsLeft % 60, 2)
    return `${hours ? hours + ':' : ''}${minutes}:${seconds}`
  },
  render () {
    return <Text>{this.format(this.state.secondsLeft)}</Text>
  }
})
