import React from "react";
import "./abc-line.css";

export interface ABCLineProps {
  letter?: string;
}

export const ABCLine: React.FC<ABCLineProps> = ({ letter }) => {
  return <div className="abc-line">{letter ? letter : ""}</div>;
};
