import { createContext,  JSX,  ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { Drawer } from 'sober/drawer'
const appState = {
    loading: false,
    toc: <h2 style={{color:"var(--s-color-secondary)",padding:"4px 15px"}}>暂无目录或标签</h2> as JSX.Element,
    drawerRef : null as Drawer | null,
}
type AppStateT = typeof appState;

const AppContext = createContext<ReturnType<typeof createStore<AppStateT>>>();

export const AppContextProvider: ParentComponent = (props) => {
  const value = createStore(appState);
  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
};

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("can't find LoadingContext")
  }
  return context
}