import React from 'react'
import Card from '../Card'
import {IIconProps} from '../icons/types'

export interface IInfoCardProps {
  title: string
  description: string
  Icon: React.FC<IIconProps>
}

export default function InfoCard({title, description, Icon}: IInfoCardProps) {
  return (
    <Card shadow="base">
      <Icon className="w-8 md:w-10 h-auto fill-gray-dark" />
      <h2 className="opacity-90 my-1">{title}</h2>
      <p className="text-gray-dark text-sm">{description}</p>
    </Card>
  )
}
