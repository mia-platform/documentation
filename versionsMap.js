import {satisfies} from 'semver'

const versionsMap = {
  current: '14.4.0',
  next: '14.4.1',
  lts: ['14.1.x', '14.4.x']
}

export const isCurrent = (version) => versionsMap.current === version
export const isNext = (version) => versionsMap.next === version
export const isLts = (version) => versionsMap.lts.some((range) => satisfies(version, range))

export const getType = (version) => {
  if (isCurrent(version)) { return 'current' }
  if (isNext(version)) { return 'next' }
  if (isLts(version)) { return 'lts' }
  return null
}

export default versionsMap
