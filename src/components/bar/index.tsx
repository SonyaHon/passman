import { InputText } from "primereact/inputtext";
import { $mainSearch } from "../../store";

import "./index.css";
import { KeyboardShortcut } from "../kbd-shortcut";
import { useRef } from "react";
import { useAtom } from "jotai";

export const Bar = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  function focusSearchField() {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }

  const [searchText, setSearchText] = useAtom($mainSearch);

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
        <KeyboardShortcut
          onPress={focusSearchField}
          shortcut="cmd+k"
          className="bar-search-kbd"
        />
      </div>
    </div>
  );
};
