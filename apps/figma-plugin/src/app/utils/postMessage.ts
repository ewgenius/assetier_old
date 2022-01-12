import { MessageType } from "../../types";

export function postMessage(type: MessageType, data?: any) {
  parent.postMessage({ pluginMessage: { type, data } }, "*");
}
