import { AssetMetaInfo } from "@assetier/types";
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
  figma.loadFontAsync({ family: "Roboto", style: "Regular" });

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

    case MessageType.ExportNodes: {
      const exportedNodes = data as Record<string, AssetMetaInfo>;

      Object.keys(exportedNodes).map((nodeId) => {
        const meta = exportedNodes[nodeId];
        const node = figma.getNodeById(nodeId);
        console.log(nodeId);
        console.log(node);

        if (node && (node.type === "FRAME" || node.type === "COMPONENT")) {
          node.setPluginData("assetier.repo.owner", meta.repoOwner);
          node.setPluginData("assetier.repo.name", meta.repoName);
          node.setPluginData("assetier.repo.sha", meta.repoSha);
          node.setPluginData("assetier.repo.url", meta.url);

          if (!node.getPluginData("assetier.node.link")) {
            const link = figma.createText();
            link.characters = "github link 🔗";
            link.fontSize = 8;
            link.hyperlink = {
              type: "URL",
              value: meta.url,
            };
            link.x = node.x;
            link.y = node.y + node.height + 8;
            node.setPluginData("assetier.node.link", link.id);
          }
        }
      });
      break;
    }
  }
};
