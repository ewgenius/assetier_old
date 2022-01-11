import * as React from "react";

export interface AppContextInterface {
  token: string;
}

export const AppContext = React.createContext<AppContextInterface>({
  token: "",
});

export const useAppContext = () => {
  return React.useContext(AppContext);
};
