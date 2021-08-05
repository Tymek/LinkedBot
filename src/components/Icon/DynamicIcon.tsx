import React, { FC } from 'react'

export type DynamicIconProps = {
  name: string
  ratio?: number
}

const DynamicIcon: FC<DynamicIconProps> = ({ name, ratio = 1 }) => {
  return <span uk-icon={`icon: ${name}; ratio: ${ratio}`} />
}

export default DynamicIcon
