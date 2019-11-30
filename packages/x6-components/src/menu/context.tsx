import React, { MouseEvent } from "react";

export const MenuContext = React.createContext<MenuContext.Contexts>({} as any);

export namespace MenuContext {
  export interface Contexts {
    prefixCls: string;
    onClick: (name: string, e?: MouseEvent) => void;
    registerHotkey: (hotkey: string, handler: () => any) => void;
    unregisterHotkey: (hotkey: string, handler: () => any) => void;
  }
}
