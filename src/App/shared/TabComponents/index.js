import React from 'react'
import cc from 'create-react-class'
import { Flex, Box, settings as s } from 'boostly-ui'
const tabStyles = {
  display: 'inline-block',
  padding: 10,
  margin: 10,
  cursor: 'pointer',
  color: s.colors.textOnLight
}

const styles = {
  tab: tabStyles,
  activeTab: {
    ...tabStyles,
    borderRadius: '3px',
    backgroundColor: s.colors.base
  },
  disabledTab: { ...tabStyles, opacity: 0.25, cursor: 'default' }
}

export const Tab = ({ onClick, isDisabled, isActive, children }) => {
  return (
    <div
      {...{
        onClick: isDisabled ? null : onClick,
        style: isDisabled
          ? styles.disabledTab
          : isActive ? styles.activeTab : styles.tab
      }}
    >
      {children}
    </div>
  )
}

export const TabList = ({ children, activeIndex, onActivate }) => (
  <div>
    {children({ activeIndex, onActivate })}
  </div>
)

export const TabPanels = ({ children, activeIndex }) => (
  <div>
    {children({ activePanelIndex: activeIndex })}
  </div>
)

export const Tabs = cc({
  getInitialState () {
    return { activeIndex: 0 }
  },
  render () {
    const { props: { children }, state: { activeIndex } } = this

    return (
      <div>
        {
          React.Children.map(
            children,
            (child, index) =>
              child.type === TabPanels
                ? React.cloneElement(child, { activeIndex })
                : child.type === TabList
                  ? React.cloneElement(child, {
                    activeIndex,
                    onActivate: activeIndex => this.setState({ activeIndex })
                  })
                  : child
          )
        }
      </div>
    )
  }
})
