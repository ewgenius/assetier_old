import { Message, MessageType } from "./types";

figma.showUI(__html__, {
  width: 300,
  height: 480,
});

function updateSelection() {
  console.log(figma.currentPage.selection);
  figma.ui.postMessage({
    type: MessageType.ReceiveSelectedNodes,
    data: {
      selection: figma.currentPage.selection,
    },
  });
}

figma.on("run", async () => {
  await figma.clientStorage.setAsync("assetier-token", "");
  const token = await figma.clientStorage.getAsync("assetier-token");
  figma.ui.postMessage({
    type: MessageType.Init,
    data: {
      token,
    },
  });

  if (token) {
    updateSelection();
  }
});

figma.on("selectionchange", () => {
  updateSelection();
});

figma.ui.onmessage = async ({ type, data }: Message) => {
  switch (type) {
    case MessageType.SetToken: {
      await figma.clientStorage.setAsync("assetier-token", data.token);
      break;
    }

    case MessageType.GetSelectedNodes: {
      figma.ui.postMessage({
        type: MessageType.ReceiveSelectedNodes,
        data: {
          selection: figma.currentPage.selection,
        },
      });
      break;
    }
  }
};
