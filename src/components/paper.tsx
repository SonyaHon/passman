import React, { PropsWithChildren } from "react";
import "./paper.css";

export interface PaperProps extends PropsWithChildren {
  hoverable?: boolean;
  elevated?: boolean;
  onClick?: () => void | Promise<void>;
}

export const Paper: React.FC<PaperProps> = ({
  children,
  hoverable,
  elevated,
  onClick,
}) => {
  const classes = [
    "paper",
    hoverable ? "paper-hoverable" : "",
    elevated ? "paper-elevated" : "",
  ].join(" ");

  function onClickHandler() {
    if (onClick) {
      onClick();
    }
  }

  return (
    <div onClick={onClickHandler} className={classes}>
      {children}
    </div>
  );
};
