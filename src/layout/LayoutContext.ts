import { createContext } from 'react';

type TSiderState = {
  siderWidth: number;
  siderCollapsedWidth: number;
  collapsed: boolean;
  toggleCollapsed: (collapsed: boolean) => void;
  hideMenu: boolean;
  toggleHideMenu: (hideMenu: boolean) => void;
};

export default createContext({} as TSiderState);
