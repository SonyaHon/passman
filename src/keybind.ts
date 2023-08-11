const propMap = {
  cmd: "metaKey",
  ctrl: "ctrlKey",
};

export type Shortcut = `${"cmd" | "ctrl"}+${
  | "q"
  | "w"
  | "e"
  | "r"
  | "t"
  | "y"
  | "u"
  | "i"
  | "o"
  | "p"
  | "a"
  | "s"
  | "d"
  | "f"
  | "g"
  | "h"
  | "j"
  | "k"
  | "l"
  | "z"
  | "x"
  | "c"
  | "v"
  | "b"
  | "n"
  | "m"
  | "<"
  | ">"
  | "["
  | "]"
  | ";"}`;

export class Keybind {
  constructor(
    private readonly shortcut: Shortcut,
    private f: () => void | Promise<void>
  ) {
    window.addEventListener("keypress", this.handler.bind(this));
  }

  handler(event: KeyboardEvent) {
    const [meta, key] = this.shortcut.split("+");
    if (
      // @ts-ignore
      event[propMap[meta]] &&
      event.key.toUpperCase() === key.toUpperCase()
    ) {
      this.f();
    }
  }

  updateHandler(f: () => void | Promise<void>) {
    this.f = f;
  }

  getString() {
    return this.shortcut;
  }
}
