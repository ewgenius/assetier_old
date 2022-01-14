import * as React from "react";
import type { Reducer, Dispatch } from "react";
import { NodeInfo } from "../types";

export enum AppPage {
  Boot,
  SignIn,
  Settings,
  Main,
}

export interface AppState {
  page: AppPage;
  token: string | null;
  selectedNodes: NodeInfo[];
  organizationId?: string | null;
  projectId?: string | null;
  setOrgProject?: (organizationId: string, projectId: string) => void;
}

export interface AppStateContext extends AppState {
  dispatch: Dispatch<Actions>;
}

export const AppContext = React.createContext<AppStateContext>({
  page: AppPage.Boot,
  token: null,
  selectedNodes: [],
  dispatch: () => {},
  setOrgProject: () => {},
});

export const useAppContext = () => {
  return React.useContext(AppContext);
};

// Reducer

export enum ActionType {
  Boot = "boot",
  StoredStateReceived = "stored-state-received",
  SelectedNodesUpdated = "selected-nodes-updated",
  SignedIn = "signed-in",
  NextPage = "next-page",
}

// Actions

export interface Action<T = any> {
  type: ActionType;
  payload?: T;
}

export interface BootAction extends Action {
  type: ActionType.Boot;
}

export interface StoredStateReceivedAction extends Action<Partial<AppState>> {
  type: ActionType.StoredStateReceived;
}

export interface NextPageAction extends Action {
  type: ActionType.NextPage;
}

export interface SingedInAction
  extends Action<{ token: string; organizationId: string; projectId: string }> {
  type: ActionType.SignedIn;
}

export interface SelectedNodesUpdatedAction
  extends Action<{ selectedNodes: NodeInfo[] }> {
  type: ActionType.SelectedNodesUpdated;
}

export type Actions =
  | BootAction
  | StoredStateReceivedAction
  | NextPageAction
  | SingedInAction
  | SelectedNodesUpdatedAction;

export const appStateReducer: Reducer<AppState, Actions> = (
  state,
  { type, payload }
) => {
  switch (type) {
    case ActionType.Boot:
      return {
        ...state,
        page: AppPage.Boot,
      };

    case ActionType.StoredStateReceived:
      return {
        ...state,
        ...payload,
      };

    case ActionType.SignedIn:
      return {
        ...state,
        token: payload.token,
        organizationId: payload.organizationId,
        projectId: payload.projectId,
        page: AppPage.Main,
      };

    case ActionType.SelectedNodesUpdated:
      return {
        ...state,
        selectedNodes: payload.selectedNodes,
      };

    // debug

    case ActionType.NextPage:
      return {
        ...state,
        page:
          state.page === AppPage.Boot
            ? AppPage.SignIn
            : state.page === AppPage.SignIn
            ? AppPage.Main
            : state.page === AppPage.Main
            ? AppPage.Settings
            : AppPage.Boot,
      };

    default:
      return state;
  }
};
