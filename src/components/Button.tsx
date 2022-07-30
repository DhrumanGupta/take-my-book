import clsx from 'clsx'
import * as React from 'react'

export interface IButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => any
  children?: React.ReactNode
}

interface IBaseButtonProps extends IButtonProps {
  className: string
}

function BaseButton(props: IBaseButtonProps) {
  const className = clsx('p-5 rounded-md', props.className)
  return (
    <button onClick={props.onClick} className={className}>
      {props.children}
    </button>
  )
}

function SecondaryButton(props: IButtonProps) {
  return (
    <BaseButton {...props} className="text-white bg-orange">
      {props.children}
    </BaseButton>
  )
}

function PrimaryButton(props: IButtonProps) {
  return (
    <BaseButton {...props} className="text-white bg-orange">
      {props.children}
    </BaseButton>
  )
}

export {PrimaryButton, SecondaryButton}
