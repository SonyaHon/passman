import { Paper } from "./paper";
import "./main-search.css";
import { SearchIcon } from "../icons/search";
import { PlusIcon } from "../icons/plus";
import { useSetAtom } from "jotai";
import { $selectedEntry } from "../store";
import { DetailedCard } from "../types";

export const MainSearch = () => {
  const set = useSetAtom($selectedEntry);
  async function createNewEntry() {
    set(DetailedCard.Empty());
  }

  return (
    <div className="main-search">
      <Paper>
        <div className="search-content">
          <SearchIcon />
          <input placeholder="Search..." />
        </div>
      </Paper>
      <div className="add-button-wrapper">
        <Paper hoverable onClick={createNewEntry}>
          <div className="add-button">
            <PlusIcon />
          </div>
        </Paper>
      </div>
    </div>
  );
};
