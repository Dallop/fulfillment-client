import React from 'react'
import { connect } from 'react-redux'
import cc from 'create-react-class'
import pt from 'prop-types'
import { css } from 'glamor'
import {
  Flex,
  Box,
  Title,
  Text,
  Button,
  Modal,
  settings as s
} from 'boostly-ui'
import { formatPhone } from 'utils/rendering'
import { logout } from 'App/state/session'
import Nav, { NavHeight } from 'App/shared/Nav'
import AlarmIcon from 'App/shared/AlarmIcon'
import Avatar from 'App/shared/Avatar'
import MenuDropdown from 'App/shared/MenuDropdown'
import {
  getNewOrderEntities,
  getTodaysOrderEntities,
  getConsumerEntity,
  changeOrderStatus,
  selectors,
  updatePrepTime,
  getLocationEntity
} from './state'
import { Tabs, TabList, TabPanels } from 'App/shared/TabComponents'
import OrderListing from './components/OrderListing'
import PrepTimeForm from './components/PrepTimeForm'
import Sound from 'react-sound'

const Tab = ({ label, isActive, ...rest }) => (
  <Box
    {...rest}
    py={1}
    px={1}
    textAlign='center'
    backgroundColor={isActive ? s.colors.base : 'transparent'}
    style={{ borderRadius: '8px' }}
    transition='.25s'
    cursor='pointer'
    border={`solid 1px ${isActive ? 'transparent' : s.colors.darkBase}`}
  >
    <Title>{label}</Title>
  </Box>
)

const MenuOptions = connect()(
  cc({
    onRequestLogOut () {
      this.props.dispatch(logout())
    },
    render () {
      return (
        <MenuDropdown
          items={[
              (
                <Box onClick={this.onRequestLogOut} whiteSpace='nowrap'>
                  Log Out
                </Box>
              )
          ]}
        >
          <Avatar name={this.props.locationDetails.name} />
        </MenuDropdown>
      )
    }
  })
)

const Noise = cc({
  getInitialState () {
    return { play: true }
  },
  onFinish () {
    this.setState(prev => ({ play: false }), () => {
      window.setTimeout(
        () => {
          this.setState(prev => ({ play: true }))
        },
        1000
      )
    })
  },
  render () {
    return (
      <Box>
        {
          this.state.play &&
            (
              <Sound
                url='/sounds/bike-horn.mp3'
                playStatus={Sound.status.PLAYING}
                onFinishedPlaying={this.onFinish}
              />
            )
        }
      </Box>
    )
  }
})
const NotifCountIcon = ({ count, size = '25px' }) => (
  <Flex
    border-radius='50%'
    bg={s.colors.primaryCta}
    w={size}
    height={size}
    align='center'
    justify='center'
  >
    <Text onDark>{count}</Text>
  </Flex>
)
let flash = css.keyframes({
  '0%': { opacity: 0 },
  '60%': { opacity: 1 },
  '100%': { opacity: 0 }
})

const flashProps = (direction = 'bottom') => ({
  zIndex: '101',
  position: 'fixed',
  width: '100%',
  height: '50px',
  animation: `${flash} 0.5s infinite`,
  background: `linear-gradient(to ${direction}, ${s.colors.primaryCta} 0%, rgba(255,255,255,0) 100%)`
})

const Alert = () => (
  <Box>
    {false && <Noise />}
    <Box {...flashProps()} left='0' top='0' />
    <Box z-Index='101' {...flashProps('top')} left='0' bottom='0' />
  </Box>
)
const ManageOrders = cc({
  propTypes: {
    newOrders: pt.array,
    orders: pt.array,
    ordersAwaitingCompletion: pt.array,
    completedOrders: pt.array,
    getNewOrders: pt.func,
    getOrders: pt.func,
    updatePrepTime: pt.func,
    locationDetails: pt.object
  },
  getInitialState () {
    return {
      newestApprovedOrders: [],
      orderRequestingApproval: null,
      orderRequestingDecline: null,
      showPrepTimeMenu: false
    }
  },
  componentDidMount () {
    this.props.getOrders()
    this.props.getLocationDetails()
  },
  getConsumerEntities (orders) {
    orders.forEach(o => {
      if (typeof o.consumer === 'string') {
        this.props.getConsumer(o.consumer)
      }
    })
  },
  componentWillReceiveProps ({ newOrders, orders }) {
    if (
      newOrders.length > this.props.newOrders.length ||
        orders.length > this.props.orders.length
    ) {
      this.getConsumerEntities([ ...orders, ...newOrders ])
    }
  },
  onOrderApproveRequest (orderRequestingApproval) {
    this.setState(prev => ({ orderRequestingApproval }))
  },
  approveOrder (id) {
    this.props.approveOrder(id)
    this.setState(prev => ({
      orderRequestingApproval: null,
      newestApprovedOrders: [ ...prev.newestApprovedOrders, id ]
    }))
  },
  requestDeclineOrder (ord) {
    this.setState(prev => ({ orderRequestingDecline: ord }))
  },
  declineOrder (id) {
    this.props.declineOrder(id)
    this.setState(prev => ({
      orderRequestingApproval: null,
      orderRequestingDecline: null
    }))
  },
  toggleStatus ({ status, id }) {
    if (status === 'inProgress') {
      this.props.markAsFulfilled(id)
    } else {
      this.props.markAsInProgress(id)
    }
  },
  togglePrepTimeMenu () {
    this.setState(prev => ({ showPrepTimeMenu: !prev.showPrepTimeMenu }))
  },
  updatePrepTime (settings) {
    this.togglePrepTimeMenu()
    this.props.updatePrepTime(settings)
  },
  getNotifCount (i) {
    return {
      0: () => this.props.newOrders.length,
      1: () => this.state.newestApprovedOrders.length
    }[i]()
  },
  handleTabClick (i) {
    if (i === 1) {
      this.setState({ newestApprovedOrders: [] })
    }
  },
  renderTabPanel: {
    0: $this => (
      <Box>
        {!$this.props.newOrders.length && (
        <Flex align='center' textAlign='center' column pt='10%'>
          <Title fontSize={4} pb={2}>
                  Waiting On Orders
                </Title>
          <Box
            is='img'
            p={1}
            alt='boy patiently waiting'
            w='300px'
            src='https://media.giphy.com/media/tXL4FHPSnVJ0A/giphy.gif'
                />
        </Flex>
            )}
        {$this.props.newOrders
            .filter(no => typeof no.consumer !== 'string')
            .map((no, i) => (
              <Box
                key={no.id}
                borderBottom={`solid 1px ${s.colors.darkBase}`}
                onClick={() => $this.onOrderApproveRequest(no)}
              >
                <OrderListing details={no} />
              </Box>
            ))}
      </Box>
    ),
    1: $this => (
      <Box>
        {$this.props.orders
            .filter(order => typeof order.consumer !== 'string')
            .map((order, i) => (
              <Flex
                key={order.id}
                borderBottom={`solid 1px ${s.colors.darkBase}`}
              >
                <CompletionBox
                  onClick={() => $this.toggleStatus(order)}
                  isComplete={order.status === 'fulfilled'}
                />
                <OrderListing details={order} />
              </Flex>
            ))}
      </Box>
    )
  },
  render () {
    const {
      orderRequestingApproval: ora,
      orderRequestingDecline: ord,
      showPrepTimeMenu
    } = this.state
    return (
      <Box w='100%' height='100%' paddingTop={NavHeight}>
        {this.props.newOrders.length ? <Alert /> : ''}
        <Box
          position='fixed'
          w='100%'
          bg={s.colors.lightBaseHighlight}
          p={2}
          bottom={ora ? 0 : '-100%'}
          left={0}
          zIndex={1}
          transition='.25s'
          textAlign='center'
          border-top={`solid 1px ${s.colors.base}`}
        >
          {ora && (
          <Box>
            <Box py={2}>
              <Text fontSize={3}>
                      Will you approve{' '}
                {ora.consumer.firstName} {' '}
                {`${ora.consumer.lastName}'s`}
                {' '}order?
                    </Text>
            </Box>
            <Flex pb={2} justify='space-around'>
              <Box w='40%'>
                <Button
                  onClick={() => this.approveOrder(ora.id)}
                  children='Approve Order'
                  theme='secondary'
                      />
              </Box>
              <Box w='40%'>
                <Button
                  onClick={() => this.requestDeclineOrder(ora)}
                  children='Decline Order'
                      />
              </Box>
            </Flex>
          </Box>
              )}
        </Box>
        <Modal
          contentLabel='Change Prep Time'
          heading={<Title fontSize={3}>Change Prep Time</Title>}
          isOpen={showPrepTimeMenu}
          onRequestClose={this.togglePrepTimeMenu}
        >
          <PrepTimeForm
            onSubmit={this.updatePrepTime}
            currentPrepSettings={this.props.locationDetails.updatedPrepSettings}
          />
        </Modal>
        <Modal
          contentLabel='Decline Order'
          heading={<Title fontSize={3}>Are you sure you?</Title>}
          isOpen={!!ord}
          onRequestClose={
            () => this.setState(prev => ({ orderRequestingDecline: null }))
          }
        >
          {ord && (
          <Box p={2} maxWidth='400px'>
            <Box>
              <Text>
                      If so, hit confirm when you’ve followed these steps:
                    </Text>
            </Box>
            <Box is='ol' p={2}>
              <Box is='li'>
                      Call {' '}
                <Title>{ord.consumer.firstName}</Title>
                {' '}at{' '}
                <Title>{formatPhone(ord.consumer.phoneNumber)}</Title>
                {' '}
                      to let them know that the order will not be fulfilled.
                    </Box>
              <Box is='li'>
                      If applicable, offer to prepare an alternative order.
                    </Box>
              <Box is='li'>
                      If the customer doesn’t answer, leave a message.
                    </Box>
            </Box>
            <Box>
              <Box p={1}>
                      *A text will automatically be sent to the customer when you press confirm.
                    </Box>
              <Button onClick={() => this.declineOrder(ord.id)}>
                      Confirm Decline Order
                    </Button>
            </Box>
          </Box>
              )}
        </Modal>
        <Nav
          center={(
            <Box onClick={this.togglePrepTimeMenu}>
              <AlarmIcon />
            </Box>
            )}
          right={<MenuOptions locationDetails={this.props.locationDetails} />}
        />
        <Box pb={ora ? '300px' : 1}>
          <Tabs>
            <TabList>
              {({ activeIndex, onActivate }) => (
                <Flex justify='space-around' py={2} px={1}>
                  {[ 'New Orders', `Today's Orders` ].map((label, i) => {
                    const isActive = activeIndex === i
                    const notifCount = this.getNotifCount(i)
                    return (
                      <Box w='40%' position='relative' key={i}>
                        <Box position='absolute' top='-8px' right='-8px'>
                          {
                                !isActive &&
                                  !!notifCount &&
                                  <NotifCountIcon count={notifCount} />
                              }
                        </Box>
                        <Tab
                          key={i}
                          isActive={activeIndex === i}
                          onClick={
                                () => this.handleTabClick(i, onActivate(i))
                              }
                          label={label}
                            />
                      </Box>
                    )
                  })}
                </Flex>
                )}
            </TabList>
            <TabPanels>
              {
                ({ activePanelIndex }) =>
                  this.renderTabPanel[activePanelIndex](this)
              }
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    )
  }
})

const selector = (state, props) => ({
  consumers: state.entities.consumers,
  newOrders: selectors.getNewOrders(props.match.params)(state),
  orders: selectors.getOrders(props.match.params)(state),
  locationDetails: selectors.getLocationDetails(props.match.params)(state)
})

const actions = (dispatch, props) => {
  const docIds = props.match.params
  return {
    updatePrepTime: prepSettings =>
      dispatch(updatePrepTime(docIds)(prepSettings)),
    approveOrder: id => dispatch(changeOrderStatus(id, 'inProgress')),
    declineOrder: id => dispatch(changeOrderStatus(id, 'declined')),
    markAsInProgress: id => dispatch(changeOrderStatus(id, 'inProgress')),
    markAsFulfilled: id => dispatch(changeOrderStatus(id, 'fulfilled')),
    getOrders: () => {
      dispatch(getNewOrderEntities(docIds))
      dispatch(getTodaysOrderEntities(docIds))
    },
    getConsumer: id => dispatch(getConsumerEntity(id)),
    getLocationDetails: id => dispatch(getLocationEntity(docIds))
  }
}

export default connect(selector, actions)(ManageOrders)

const CompletionBox = ({ isComplete, onClick }) => (
  <Box
    border={`solid 1px ${s.colors.baseHighlight}`}
    onClick={onClick}
    cursor='pointer'
    height='94px'
  >
    <Flex
      w='94px'
      justify='center'
      align='center'
      height='100%'
      border={`solid 18px ${s.colors.base}`}
    >
      {isComplete && (
      <Box
        is='svg'
        version='1.1'
        xmlns='http://www.w3.org/2000/svg'
        x='0px'
        y='0px'
        width='40px'
        viewBox='0 0 512 512'
            >
        <polygon
          fill={s.colors.success}
          points='202.624,478.016 0,291.36 70.512,214.8 191.968,326.656 431.44,33.984 512,99.904 '
              />
      </Box>
          )}
    </Flex>
  </Box>
)
