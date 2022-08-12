import clsx from "clsx";
import React from "react";

export interface ICardProps {
  children?: React.ReactNode;
  className?: string;
  shadow?: "sm" | "base" | "md" | "lg";
}

export default function Card(props: ICardProps) {
  return (
    <div
      className={clsx(
        "p-5 rounded-md bg-gray-light",
        props.shadow !== undefined &&
          `shadow${props.shadow !== "base" ? `-${props.shadow}` : ""}`,
        props.className
      )}
    >
      {props.children}
    </div>
  );
}
