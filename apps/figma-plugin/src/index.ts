import { PluginMessage, MessageType } from "./types";

figma.showUI(__html__, {
  width: 300,
  height: 480,
});

function updateSelection() {
  figma.ui.postMessage({
    type: MessageType.ReceiveSelectedNodes,
    data: {
      nodes: figma.currentPage.selection.map((node) => ({
        id: node.id,
        name: node.name,
      })),
    },
  });
}

figma.on("run", async () => {
  const token = await figma.root.getPluginData("assetier-token");
  const organizationId = figma.root.getPluginData("assetier-organization-id");
  const projectId = await figma.root.getPluginData("assetier-project-id");

  figma.ui.postMessage({
    type: MessageType.Init,
    data: {
      token,
      organizationId,
      projectId,
    },
  });

  if (token) {
    updateSelection();
  }
});

figma.on("selectionchange", () => {
  updateSelection();
});

figma.ui.onmessage = async ({ type, data }: PluginMessage) => {
  switch (type) {
    case MessageType.SetToken: {
      await figma.root.setPluginData("assetier-token", data.token);
      await figma.root.setPluginData(
        "assetier-organization-id",
        data.organizationId
      );
      await figma.root.setPluginData("assetier-project-id", data.projectId);
      break;
    }

    case MessageType.SetOrgProject: {
      await figma.root.setPluginData(
        "assetier-organization-id",
        data.organizationId
      );
      await figma.root.setPluginData("assetier-project-id", data.projectId);

      break;
    }
  }
};
