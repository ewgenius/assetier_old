import * as React from "react";

export interface AppContextInterface {
  token: string;
  organizationId?: string | null;
  projectId?: string | null;
  setOrgProject: (organizationId: string, projectId: string) => void;
}

export const AppContext = React.createContext<AppContextInterface>({
  token: "",
  setOrgProject: () => {},
});

export const useAppContext = () => {
  return React.useContext(AppContext);
};
