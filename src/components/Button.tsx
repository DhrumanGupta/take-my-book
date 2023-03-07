import clsx from "clsx";
import * as React from "react";

export interface IButtonProps {
  onClick?: (event: any) => any;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

function BaseButton(props: IButtonProps) {
  const className = clsx(
    "px-5 py-3 rounded-xl duration-100",
    props.className,
    props.disabled === true &&
      "hover:bg-gray-dark bg-gray-dark hover:cursor-not-allowed"
  );
  return (
    <button onClick={props.onClick} className={className}>
      {props.children}
    </button>
  );
}

function SecondaryButton(props: IButtonProps) {
  return (
    <BaseButton
      {...props}
      className={clsx(
        "bg-white border-2 border-black !text-black hover:bg-gray-light",
        props.className
      )}
    >
      {props.children}
    </BaseButton>
  );
}

function PrimaryButton(props: IButtonProps) {
  return (
    <BaseButton
      {...props}
      className={clsx(
        "text-white bg-orange hover:bg-darkOrange",
        props.className
      )}
    >
      {props.children}
    </BaseButton>
  );
}

export { PrimaryButton, SecondaryButton };
