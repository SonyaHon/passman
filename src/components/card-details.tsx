import React from "react";

import "./card-details.css";
import { useAtom, useAtomValue } from "jotai";
import { $selectedEntry } from "../store";
import { Paper } from "./paper";

const CardDetailsNoEntry = () => {
  return (
    <div className="no-entry">
      <span>Select a card to show its info</span>
    </div>
  );
};

interface DetailsInputProps {
  label: string;
}

const DetailsInput: React.FC<DetailsInputProps> = ({ label }) => {
  return (
    <div className="details-input">
      <div className="label">{label}</div>
      <input />
    </div>
  );
};

const CardDetailsEditing = () => {
  const [card, setCard] = useAtom($selectedEntry);

  if (!card) {
    return <></>;
  }

  return (
    <div className="editing">
      <div className="section-title">Entry details</div>
      <div className="entry-details">
        <Paper>
          <div className="entry-details-content">
            <DetailsInput label="Title" />
          </div>
        </Paper>
      </div>
    </div>
  );
};

export const CardDetails: React.FC = () => {
  const selectedEntry = useAtomValue($selectedEntry);
  return (
    <div className="card-details">
      {selectedEntry ? <CardDetailsEditing /> : <CardDetailsNoEntry />}
    </div>
  );
};
