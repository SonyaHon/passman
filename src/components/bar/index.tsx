import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";

import { useRef } from "react";
import { useAtom, useAtomValue } from "jotai";

import { $editingEntry, $mainSearch, useEdit } from "../../store";
import { KeyboardShortcut } from "../kbd-shortcut";

import "./index.css";
import { KeybindRegistry } from "../../keybind-registry";
import { CreateNewDialog } from "../create-new-dialog";
import { Entry } from "../../entry";

export const Bar = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const focusSearchField = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  };

  const editedEntry = useAtomValue($editingEntry);
  const startEditing = useEdit();
  const createNewEntry = () => {
    startEditing(Entry.Empty());
  };

  const [searchText, setSearchText] = useAtom($mainSearch);

  const keybindSearch = KeybindRegistry.register("cmd+k", focusSearchField);
  const keybindAddNew = KeybindRegistry.register("cmd+n", createNewEntry);

  return (
    <div className="bar">
      <div>
        <svg
          display="inline-block"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>

        <InputText
          ref={inputRef}
          className="p-inputtext-sm"
          placeholder="Search"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
        />
        <KeyboardShortcut keybind={keybindSearch} className="bar-search-kbd" />
      </div>
      <Tooltip target="#btn-create-new" showDelay={1000}>
        <KeyboardShortcut keybind={keybindAddNew} />
      </Tooltip>
      <Button
        id="btn-create-new"
        outlined
        size="small"
        severity="secondary"
        label="+"
        onClick={createNewEntry}
      />
      { editedEntry && <CreateNewDialog /> }
    </div>
  );
};
