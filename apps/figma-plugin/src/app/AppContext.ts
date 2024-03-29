import React from "react";
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
  accessToken: string | null;
  refreshToken: string | null;
  selectedNodes: NodeInfo[];
  accountId?: string | null;
  projectId?: string | null;
  setAccountProject?: (accountId: string, projectId: string) => void;
}

export interface AppStateContext extends AppState {
  dispatch: Dispatch<Actions>;
}

export const AppContext = React.createContext<AppStateContext>({
  page: AppPage.Boot,
  accessToken: null,
  refreshToken: null,
  selectedNodes: [],
  dispatch: () => {},
  setAccountProject: () => {},
});

export const useAppContext = () => {
  return React.useContext(AppContext);
};

// Reducer

export enum ActionType {
  Boot = "boot",
  Authorized = "authorized",
  SetAccountProject = "set-account-project",

  StoredStateReceived = "stored-state-received",
  SelectedNodesUpdated = "selected-nodes-updated",
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

export interface SetAccountProject
  extends Action<{ accountId: string; projectId: string }> {
  type: ActionType.SetAccountProject;
}

export interface AuthorizedAction
  extends Action<{
    accessToken: string;
    refreshToken: string;
  }> {
  type: ActionType.Authorized;
}

export interface SelectedNodesUpdatedAction
  extends Action<{ selectedNodes: NodeInfo[] }> {
  type: ActionType.SelectedNodesUpdated;
}

export type Actions =
  | BootAction
  | AuthorizedAction
  | StoredStateReceivedAction
  | NextPageAction
  | SetAccountProject
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

    case ActionType.Authorized:
      return {
        ...state,
        ...payload,
        page: AppPage.Main,
      };

    case ActionType.SetAccountProject:
      return {
        ...state,
        accountId: payload.accountId,
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
