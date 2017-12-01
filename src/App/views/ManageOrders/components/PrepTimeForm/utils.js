export const hoursToMilliseconds = hours => hours * 60 * 60000
export const settingsAreActive = ({ startTime, duration }) => {
  const startMils = new Date(startTime).getTime()
  const currentMils = new Date().getTime()
  return currentMils < startMils + hoursToMilliseconds(duration)
}
