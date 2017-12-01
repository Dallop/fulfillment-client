import React from 'react'
import { Box, Title, settings as s } from 'boostly-ui'
const Avatar = ({ size = '30px', name }) => (
  <Box
    bg={s.colors.primaryCta}
    w={size}
    height={size}
    border-radius='50%'
    position='relative'
  >
    <Bg size={size} />
    <Box
      position='absolute'
      left='50%'
      top='50%'
      transform='translate(-50%, -50%)'
    >
      <Title onDark fontSize={3}>{name && name[0]}</Title>
    </Box>
  </Box>
)

export default Avatar

const Bg = ({ color, size }) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 38 38'
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
  >
    <defs>
      <circle cx='19' cy='19' r='19' />
      <polygon
        points='3.99241511 0.078679 0.170438444 0.078679 0.170438444 3.3798473 3.99241511 3.3798473 3.99241511 0.078679'
      />
      <polygon
        points='0 38.8715547 34.7571011 38.8715547 34.7571011 0.7792337 0 0.7792337'
      />
    </defs>
    <g stroke='none' stroke-width='1' fill='none' fillRule='evenodd'>
      <g transform='translate(-125.000000, -1004.000000)'>
        <g transform='translate(63.000000, 887.000000)'>
          <g transform='translate(62.000000, 117.000000)'>
            <g mask='url(#mask-2)'>
              <g transform='translate(3.800000, 0.950000)'>
                <path
                  d='M11.61356,20.4517881 C11.61356,21.2790861 10.9410233,21.9498051 10.1114833,21.9498051 C9.28194333,21.9498051 8.61018778,21.2790861 8.61018778,20.4517881 C8.61018778,19.6244901 9.28194333,18.9537711 10.1114833,18.9537711 C10.9410233,18.9537711 11.61356,19.6244901 11.61356,20.4517881 Z'
                  id='Fill-1'
                  stroke='none'
                  fill='#A2B2C0'
                  fillRule='evenodd'
                />
                <g
                  stroke='none'
                  stroke-width='1'
                  fill='none'
                  fillRule='evenodd'
                  transform='translate(5.467778, 0.700555)'
                >
                  <polygon
                    fill='#A2B2C0'
                    mask='url(#mask-4)'
                    points='3.03711622 0.0784453 3.99241511 1.7291463 3.03711622 3.3798473 1.12573733 3.3798473 0.170438444 1.7291463 1.12573733 0.0784453'
                  />
                </g>
                <polygon
                  stroke='none'
                  fill='#A2B2C0'
                  fillRule='evenodd'
                  points='15.608709 6.5840301 16.6225912 8.3360011 15.608709 10.0871931 13.5809446 10.0871931 12.5662812 8.3360011 13.5809446 6.5840301'
                />
                <g stroke='none' fill='none' />
                <polygon
                  stroke='none'
                  fill='#A2B2C0'
                  fillRule='evenodd'
                  mask='url(#mask-6)'
                  points='31.1194667 16.9481577 33.8291411 16.9481577 33.8291411 14.2458067 31.1194667 14.2458067'
                />
                <polygon
                  stroke='none'
                  fill='#A2B2C0'
                  fillRule='evenodd'
                  mask='url(#mask-6)'
                  points='21.8437722 22.6332218 20.387 20.3538678 22.6725311 18.9010328 24.1293033 21.1803868'
                />
                <polygon
                  stroke='none'
                  fill='#A2B2C0'
                  fillRule='evenodd'
                  mask='url(#mask-6)'
                  points='5.21790033 33.423774 2.04893256 31.833835 3.640837 28.667979 6.80980478 30.257918'
                />
                <polygon
                  stroke='none'
                  fill='#A2B2C0'
                  fillRule='evenodd'
                  mask='url(#mask-6)'
                  points='25.560377 6.5697744 27.6959348 10.2778144 22.221127 9.2518714'
                />
                <polygon
                  stroke='none'
                  fill='#A2B2C0'
                  fillRule='evenodd'
                  mask='url(#mask-6)'
                  points='0 21.603228 2.14415 17.899862 4.00241333 23.137079'
                />
                <path
                  d='M29.1884038,26.692435 C29.1884038,27.519733 28.5158671,28.190452 27.6863271,28.190452 C26.8567871,28.190452 26.1850316,27.519733 26.1850316,26.692435 C26.1850316,25.865137 26.8567871,25.194418 27.6863271,25.194418 C28.5158671,25.194418 29.1884038,25.865137 29.1884038,26.692435'
                  id='Fill-14'
                  stroke='none'
                  fill='#A2B2C0'
                  fillRule='evenodd'
                  mask='url(#mask-6)'
                />
                <path
                  d='M16.1975887,14.7232558 L18.2722198,16.7922798'
                  id='Fill-15'
                  stroke='none'
                  fill='#A2B2C0'
                  fillRule='evenodd'
                  mask='url(#mask-6)'
                />
                <path
                  d='M3.28558767,12.5669838 L5.88121989,11.2037338'
                  id='Fill-16'
                  stroke='none'
                  fill='#A2B2C0'
                  fillRule='evenodd'
                  mask='url(#mask-6)'
                />
                <path
                  d='M19.5215289,3.0017986 L17.4468978,0.9327746'
                  id='Fill-17'
                  stroke='none'
                  fill='#A2B2C0'
                  fillRule='evenodd'
                  mask='url(#mask-6)'
                />
                <path
                  d='M16.14791,29.8511242 L15.1691778,27.0926852'
                  id='Fill-18'
                  stroke='none'
                  fill='#A2B2C0'
                  fillRule='evenodd'
                  mask='url(#mask-6)'
                />
                <path
                  d='M31.1189199,33.0009328 L28.1889721,33.1450478'
                  id='Fill-19'
                  stroke='none'
                  fill='#A2B2C0'
                  fillRule='evenodd'
                  mask='url(#mask-6)'
                />
                <path
                  d='M34.7574917,38.8715547 L32.9007906,36.6062227'
                  id='Fill-20'
                  stroke='none'
                  fill='#A2B2C0'
                  fillRule='evenodd'
                  mask='url(#mask-6)'
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
)
