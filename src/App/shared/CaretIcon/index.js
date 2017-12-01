import React from 'react'
import { Box, settings as s } from 'boostly-ui'
const directionToDeg = { right: '90', down: '180', up: '0' }
const CaretIcon = (
  { direction = 'right', color = s.colors.darkBase, size = '25px' }
) => (
  <Box
    is='svg'
    xmlns='http://www.w3.org/2000/svg'
    x='0px'
    y='0px'
    width={size}
    height={size}
    viewBox='0 0 307.054 307.054'
    transition='.15s'
    fill={color}
    transform={`rotate(${directionToDeg[direction]})`}
  >
    <g>
      <g>
        <g>
          <path
            d='M302.445,205.788L164.63,67.959c-6.136-6.13-16.074-6.13-22.203,0L4.597,205.788c-6.129,6.132-6.129,16.069,0,22.201l11.101,11.101c6.129,6.136,16.076,6.136,22.209,0l115.62-115.626L269.151,239.09c6.128,6.136,16.07,6.136,22.201,0l11.101-11.101C308.589,221.85,308.589,211.92,302.445,205.788z'
          />
        </g>
      </g>
    </g>
  </Box>
)

export default CaretIcon
