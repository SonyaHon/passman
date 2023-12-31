import React, { KeyboardEvent, useEffect } from "react";

import { Keybind } from "../../keybind";

import "./index.css";

export interface KeyboardShortcutProps {
  keybind: Keybind;
  className?: string;
}

const specialSymbols = {
  cmd: (
    <svg fill="currentColor" viewBox="0 0 80 80" width="9px">
      <g>
        <path
          d="M64,48L64,48h-8V32h8c8.836,0,16-7.164,16-16S72.836,0,64,0c-8.837,0-16,7.164-16,16v8H32v-8c0-8.836-7.164-16-16-16
		S0,7.164,0,16s7.164,16,16,16h8v16h-8l0,0l0,0C7.164,48,0,55.164,0,64s7.164,16,16,16c8.837,0,16-7.164,16-16l0,0v-8h16v7.98
		c0,0.008-0.001,0.014-0.001,0.02c0,8.836,7.164,16,16,16s16-7.164,16-16S72.836,48.002,64,48z M64,8c4.418,0,8,3.582,8,8
		s-3.582,8-8,8h-8v-8C56,11.582,59.582,8,64,8z M8,16c0-4.418,3.582-8,8-8s8,3.582,8,8v8h-8C11.582,24,8,20.417,8,16z M16,72
		c-4.418,0-8-3.582-8-8s3.582-8,8-8l0,0h8v8C24,68.418,20.418,72,16,72z M32,48V32h16v16H32z M64,72c-4.418,0-8-3.582-8-8l0,0v-8
		h7.999c4.418,0,8,3.582,8,8S68.418,72,64,72z"
        />
      </g>
    </svg>
  ),
};

export const KeyboardShortcut: React.FC<KeyboardShortcutProps> = ({
  keybind,
  className,
}) => {
  const items = keybind.getString().split("+");
  const elements = [];

  for (let i = 0; i < items.length; ++i) {
    // @ts-ignore
    const icon = specialSymbols[items[i]] || items[i];
    elements.push(<span key={items[i]}>{icon}</span>);
    elements.push("+");
  }
  elements.pop();

  return <div className={`keyboard-shortcut ${className}`}>{elements}</div>;
};
