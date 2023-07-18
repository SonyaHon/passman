import React from "react";
import { Paper } from "./paper";

import "./entry-card.css";
import { useAtom } from "jotai";
import { $selectedEntry } from "../store";
import { API } from "../api";

export interface EntryCardData {
  id: string;
  title: string;
  createdAt: Date;
  presentedField: string;
  icon?: string;
}

export interface EntryCardProps {
  card: EntryCardData;
}

export const EntryCard: React.FC<EntryCardProps> = ({ card }) => {
  const [currentSelected, selectEntry] = useAtom($selectedEntry);

  async function selectCard() {
    selectEntry(await API.fetchEntry(card.id));
  }

  return (
    <div className="entry-card">
      <Paper
        hoverable
        onClick={selectCard}
        elevated={currentSelected?.id === card.id}
      >
        <div className="card-content">
          <div className="card-header">
            <div className="icon">
              {card.icon ? (
                <img src={card.icon} />
              ) : (
                <div>{card.title[0].toUpperCase()}</div>
              )}
            </div>
            <div className="title">{card.title}</div>
          </div>
          <div className="data">{card.presentedField}</div>
        </div>
      </Paper>
    </div>
  );
};
