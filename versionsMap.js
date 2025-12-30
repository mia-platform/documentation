const versionsMap = {
  current: '14.4.0',
  next: '14.4.1',
  lts: ['14.1.2', '14.4.1']
}

export const isCurrent = (version) => versionsMap.current === version
export const isNext = (version) => versionsMap.next === version
export const isLts = (version) => versionsMap.lts.includes(version)

export const getType = (version) => {
  if (isCurrent(version)) { return 'current' }
  if (isNext(version)) { return 'next' }
  if (isLts(version)) { return 'lts' }
  return null
}

export default versionsMap
