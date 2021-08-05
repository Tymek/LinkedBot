import React, { FC } from 'react'
import dynamic from 'next/dynamic'

import type { DynamicIconProps } from './DynamicIcon'

// Because of hydration warnings with `UIkit.use(Icons)`
const DynamicIcon = dynamic(() => import('./DynamicIcon'), { ssr: false })

const Icon: FC<DynamicIconProps> = ({ ...props }) => {
  return <DynamicIcon {...props} />
}

export default Icon
