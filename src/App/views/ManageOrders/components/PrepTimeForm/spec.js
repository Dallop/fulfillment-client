import { hoursToMilliseconds, settingsAreActive } from './utils'
import { subMinutes } from 'date-fns'

describe('Time Functions', () => {
  test('converts given hour value to milliseconds', () => {
    expect(hoursToMilliseconds(1)).toEqual(3600000)
    expect(hoursToMilliseconds(1.5)).toEqual(5400000)
  })
  test('tells us if prep time amendments are active', () => {
    expect(
      settingsAreActive({ startTime: new Date(), duration: 1 })
    ).toEqual(true)
    expect(
      settingsAreActive({ startTime: subMinutes(new Date(), 61), duration: 1 })
    ).toEqual(false)
  })
})
