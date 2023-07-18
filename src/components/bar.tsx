import React, { useState } from "react";
import { AllEntriesIcon } from "../icons/all-entries";

import "./bar.css";
import { FavsIcon } from "../icons/favs";
import { BinIcon } from "../icons/bin";
import { FoldersIcon } from "../icons/folders";

interface BarLinkProps {
  id: number;
  title: string;
  icon: any;
  selected?: boolean;
  onClick?: () => void;
}

export const BarLink: React.FC<BarLinkProps> = ({
  title,
  icon,
  selected,
  onClick,
}) => {
  return (
    <div
      className={`barlink ${selected && onClick ? "barlink-selected" : ""}`}
      onClick={() => onClick?.()}
    >
      {icon}
      <span>{title}</span>
    </div>
  );
};

export const Bar = () => {
  const [selected, setSelected] = useState(0);

  return (
    <div className="bar">
      <BarLink
        selected={selected === 0}
        icon={<AllEntriesIcon />}
        title="All entries"
        onClick={() => setSelected(0)}
        id={0}
      />
      <BarLink
        selected={selected === 1}
        icon={<FavsIcon />}
        title="Favorites"
        onClick={() => setSelected(1)}
        id={1}
      />
      <BarLink
        selected={selected === 2}
        icon={<BinIcon />}
        title="Bin"
        onClick={() => setSelected(2)}
        id={2}
      />

      <BarLink icon={<FoldersIcon />} title="Folders" id={-1} />
    </div>
  );
};
