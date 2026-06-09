// eslint-disable-next-line no-restricted-imports
import { values, map } from 'ramda'

import { adminMessages } from '../messages'

const displayButtonTypes = {
  DISPLAY_ALWAYS: {
    name: adminMessages.productSummaryDisplayBuyButtonOptionAlways.id,
    value: 'displayButtonAlways',
  },
  DISPLAY_ON_HOVER: {
    name: adminMessages.productSummaryDisplayBuyButtonOptionHover.id,
    value: 'displayButtonHover',
  },
  DISPLAY_NONE: {
    name: adminMessages.productSummaryDisplayBuyButtonOptionNone.id,
    value: 'displayButtonNone',
  },
}

export function getDisplayButtonNames() {
  return map((opt) => opt.name, values(displayButtonTypes))
}

export function getDisplayButtonValues() {
  return map((opt) => opt.value, values(displayButtonTypes))
}

export default displayButtonTypes
