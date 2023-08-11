import { Keybind, Shortcut } from "./keybind";

class KeybindRegistryC {
  private readonly registry: Record<string, Keybind> = {};

  register(shortcut: Shortcut, handler: () => void | Promise<void>): Keybind {
    if (this.registry[shortcut]) {
      const kb = this.registry[shortcut];
      kb.updateHandler(handler);
      return kb;
    }
    const kb = new Keybind(shortcut, handler);
    this.registry[shortcut] = kb;
    return kb;
  }
}

export const KeybindRegistry = new KeybindRegistryC();
