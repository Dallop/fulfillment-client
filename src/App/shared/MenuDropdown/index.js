import React from 'react'
import { css } from 'glamor'
import Downshift from 'downshift'
import { Box, Flex, settings as s } from 'boostly-ui'
import CaretIcon from 'App/shared/CaretIcon'
const MenuDropdown = ({ items, children, ...rest }) => (
  <Downshift {...rest}>
    {
      (
        {
          getLabelProps,
          getInputProps,
          getButtonProps,
          getItemProps,
          getRootProps,
          isOpen,
          toggleMenu,
          clearSelection,
          selectedItem,
          inputValue,
          highlightedIndex
        }
      ) => (
        <div {...css({ position: 'relative' })}>
          <Flex
            onClick={toggleMenu}
            data-toggle='dropdown'
            aria-haspopup='true'
            aria-expanded={isOpen}
            align='center'
            borderRadius='6px'
          >
            <Box pr={1}>
              {children}
            </Box>
            {' '}
            <CaretIcon direction={isOpen ? 'down' : 'right'} size='20px' />
          </Flex>
          {
            isOpen
              ? <div
                {...css({
                  position: 'absolute',
                  top: '110%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: s.colors.lightBaseHighlight,
                  borderBottomLeftRadius: '6px',
                  borderBottomRightRadius: '6px',
                  boxShadow: `1px 1px 2px 1px rgba(0, 0, 0, .2)`
                })}
              >
                {items.map((item, i) => (
                  <div
                    key={item}
                    {...getItemProps({ item })}
                    {...css({
                      cursor: 'pointer',
                      padding: '10px',
                      backgroundColor: i === highlightedIndex
                          ? s.colors.lightBaseHighlight
                          : 'transparent',
                      borderBottomRightRadius: i === items.length - 1
                          ? '6px'
                          : 0,
                      borderBottomLeftRadius: i === items.length - 1
                          ? '6px'
                          : 0
                    })}
                    >
                    {item}
                  </div>
                  ))}
              </div>
              : null
          }
        </div>
      )
    }
  </Downshift>
)

export default MenuDropdown
