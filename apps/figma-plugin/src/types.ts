export enum MessageType {
  Init = "init",
  SetAuth = "set-auth",
  SetToken = "set-token",
  Setup = "setup",
  SetOrgProject = "set-org-project",
  ExportNodes = "export-nodes",

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

export interface NodeMetaInfo {
  ["assetier.repo.owner"]: string;
  ["assetier.repo.name"]: string;
  ["assetier.repo.sha"]: string;
  ["assetier.repo.url"]: string;
  ["assetier.node.link"]: string;
}

export interface NodeInfo {
  id: string;
  name: string;
  size: number;
  meta?: any;
}
