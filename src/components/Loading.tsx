import React from "react";
// @ts-ignore we know this exists but this library doesnt have definitions
import BoxLoading from "react-loadingg/lib/BoxLoading";

function Loading({ style }: { style?: React.CSSProperties }) {
  const finalStyle = {
    position: "absolute",
    left: 0,
    right: 0,
    marginLeft: "auto",
    marginRight: "auto",
    ...style,
  };
  return (
    <BoxLoading
      color={"#ff7240"}
      size={"large"}
      speed={0.8}
      style={finalStyle}
    />
  );
}

export default Loading;
