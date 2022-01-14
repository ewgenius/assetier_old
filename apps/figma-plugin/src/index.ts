import { AssetMetaInfo } from "@assetier/types";
import { PluginMessage, MessageType } from "./types";

figma.showUI(__html__, {
  width: 300,
  height: 480,
});

interface NodeInfo {
  id: string;
  name: string;
}

function extractNodes(nodes: readonly SceneNode[]): NodeInfo[] {
  return nodes.reduce<NodeInfo[]>((list, node) => {
    if (node.type === "FRAME" || node.type === "COMPONENT") {
      return [
        ...list,
        {
          id: node.id,
          name: node.name,
        },
      ];
    }

    if (node.type === "GROUP") {
      return [...list, ...extractNodes(node.children)];
    }

    return list;
  }, []);
}

function updateSelection() {
  const nodes = extractNodes(figma.currentPage.selection);

  figma.ui.postMessage({
    type: MessageType.ReceiveSelectedNodes,
    data: {
      nodes,
    },
  });
}

figma.on("run", async () => {
  figma.loadFontAsync({ family: "Roboto", style: "Regular" });

  const token = figma.root.getPluginData("assetier-token");
  const organizationId = figma.root.getPluginData("assetier-organization-id");
  const projectId = figma.root.getPluginData("assetier-project-id");

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

function setupAssetierGroup() {
  if (
    !figma.root.getPluginData("assetier.group") ||
    !figma.getNodeById(figma.root.getPluginData("assetier.group"))
  ) {
    const frame = figma.createFrame();
    frame.name = "[assetier]:legend";
    frame.x = -320 - 50;
    frame.cornerRadius = 4;
    frame.resize(320, 200);
    frame.locked = true;

    const organizationId = figma.root.getPluginData("assetier-organization-id");
    const projectId = figma.root.getPluginData("assetier-project-id");
    const assetierLink = figma.createText();
    assetierLink.characters = "assetier project ↗";
    assetierLink.hyperlink = {
      type: "URL",
      value: `${process.env.API_URL}/app/${organizationId}/projects/${projectId}`,
    };
    assetierLink.x = 16;
    assetierLink.y = 16;
    assetierLink.fontSize = 8;
    assetierLink.locked = true;
    frame.appendChild(assetierLink);

    const group = figma.group([frame], figma.root.children[0], 0);
    group.name = "[assetier]:meta";
    group.locked = true;
    figma.root.setPluginData("assetier.group", group.id);
  }
}

figma.ui.onmessage = async ({ type, data }: PluginMessage) => {
  switch (type) {
    case MessageType.SetToken: {
      figma.root.setPluginData("assetier-token", data.token);
      figma.root.setPluginData("assetier-organization-id", data.organizationId);
      figma.root.setPluginData("assetier-project-id", data.projectId);

      break;
    }

    case MessageType.Setup: {
      setupAssetierGroup();
      break;
    }

    case MessageType.SetOrgProject: {
      figma.root.setPluginData("assetier-organization-id", data.organizationId);
      figma.root.setPluginData("assetier-project-id", data.projectId);

      break;
    }

    case MessageType.ExportNodes: {
      const group = figma.getNodeById(
        figma.root.getPluginData("assetier.group")
      ) as GroupNode;
      const exportedNodes = data as Record<string, AssetMetaInfo>;

      Object.keys(exportedNodes).map((nodeId) => {
        const meta = exportedNodes[nodeId];
        const node = figma.getNodeById(nodeId);

        if (node && (node.type === "FRAME" || node.type === "COMPONENT")) {
          node.setPluginData("assetier.repo.owner", meta.repoOwner);
          node.setPluginData("assetier.repo.name", meta.repoName);
          node.setPluginData("assetier.repo.sha", meta.repoSha);
          node.setPluginData("assetier.repo.url", meta.url);

          if (
            !node.getPluginData("assetier.node.link") ||
            !figma.getNodeById(node.getPluginData("assetier.node.link"))
          ) {
            const link = figma.createText();
            link.name = `[assetier]:link ${node.name}`;
            link.characters = "github ↗";
            link.fontSize = 8;
            link.hyperlink = {
              type: "URL",
              value: meta.url,
            };
            link.locked = true;
            link.x = node.x;
            link.y = node.y + node.height + 8;
            group.appendChild(link);
            node.setPluginData("assetier.node.link", link.id);
          } else {
            const link = figma.getNodeById(
              node.getPluginData("assetier.node.link")
            ) as TextNode;
            link.hyperlink = {
              type: "URL",
              value: meta.url,
            };
            link.x = node.x;
            link.y = node.y + node.height + 8;
          }
        }
      });
      break;
    }
  }
};
