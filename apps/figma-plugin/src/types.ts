export enum MessageType {
  Init = "init",
  SetToken = "set-token",
  SetOrgProject = "set-org-project",

  GetSelectedNodes = "get-selected-nodes",
  ReceiveSelectedNodes = "receive-selected-nodes",
}

export interface PluginMessage<T = any> {
  type: MessageType;
  data: T;
}

export interface MessageInit extends PluginMessage<{ token: string }> {
  type: MessageType.Init;
}
