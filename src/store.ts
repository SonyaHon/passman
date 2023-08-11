import { atom, useSetAtom } from "jotai";
import { Entry } from "./entry";

export const $mainSearch = atom("");

export enum AppState {
  Viewing,
  Editing,
}
export const $appState = atom(AppState.Viewing);
export const $editingEntry = atom<Entry | null>(null);

export function useEdit() {
  const setEditing = useSetAtom($editingEntry);
  const setState = useSetAtom($appState);
  return (data: Entry) => {
    setEditing(data);
    setState(AppState.Editing);
  };
}

export function useStopEdit() {
  const setEditing = useSetAtom($editingEntry);
  const setState = useSetAtom($appState);
  return () => {
    setEditing(null);
    setState(AppState.Viewing);
  };
}
