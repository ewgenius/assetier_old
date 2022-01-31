import { AssetMetaInfo } from "@assetier/types";
import { PluginMessage, MessageType, NodeInfo, NodeMetaInfo } from "./types";

figma.showUI(__html__, {
  width: 300,
  height: 480,
});

function extractNodes(nodes: readonly SceneNode[]): NodeInfo[] {
  return nodes.reduce<NodeInfo[]>((list, node) => {
    if (node.type === "FRAME" || node.type === "COMPONENT") {
      return [
        ...list,
        {
          id: node.id,
          name: node.name,
          size: Math.max(node.width, node.height),
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

  if (nodes.length === 1) {
    const node = figma.getNodeById(nodes[0].id) as SceneNode;
    if (node) {
      const meta = getNodeMetaInfo(node);

      if (meta) {
        nodes[0].meta = meta;
        return figma.ui.postMessage({
          type: MessageType.ReceiveSelectedNodes,
          data: {
            nodes: [nodes[0]],
          },
        });
      }
    }
  }

  return figma.ui.postMessage({
    type: MessageType.ReceiveSelectedNodes,
    data: {
      nodes,
    },
  });
}

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

    const accountId = figma.root.getPluginData("assetier-account-id");
    const projectId = figma.root.getPluginData("assetier-project-id");
    const assetierLink = figma.createText();
    assetierLink.characters = "assetier project ↗";
    assetierLink.hyperlink = {
      type: "URL",
      value: `${process.env.API_URL}/app/${accountId}/projects/${projectId}`,
    };
    assetierLink.x = 16;
    assetierLink.y = 16;
    assetierLink.fontSize = 8;
    assetierLink.locked = true;
    frame.appendChild(assetierLink);

    const group = figma.group([frame], figma.root.children[0], 0);
    group.name = "[assetier]:meta";
    group.locked = true;
    frame.locked = true;

    figma.root.setPluginData("assetier.group", group.id);
  }
}

function setNodeMetaInfo(node: SceneNode, meta: NodeMetaInfo) {
  Object.keys(meta).forEach((key) => {
    node.setPluginData(key, meta[key as keyof NodeMetaInfo]);
  });
}

function getNodeMetaInfo(node: SceneNode): NodeMetaInfo {
  return {
    ["assetier.repo.owner"]: node.getPluginData("assetier.repo.owner"),
    ["assetier.repo.name"]: node.getPluginData("assetier.repo.name"),
    ["assetier.repo.sha"]: node.getPluginData("assetier.repo.sha"),
    ["assetier.repo.url"]: node.getPluginData("assetier.repo.url"),
    ["assetier.node.link"]: node.getPluginData("assetier.node.link"),
  };
}

figma.on("run", async () => {
  figma.loadFontAsync({ family: "Roboto", style: "Regular" });

  const accessToken = await figma.clientStorage.getAsync(
    "assetier-access-token"
  );
  const refreshToken = await figma.clientStorage.getAsync(
    "assetier-refresh-token"
  );
  const accountId = figma.root.getPluginData("assetier-account-id");
  const projectId = figma.root.getPluginData("assetier-project-id");

  console.log({
    accessToken,
    refreshToken,
    accountId,
    projectId,
  });

  figma.ui.postMessage({
    type: MessageType.Init,
    data: {
      accessToken,
      refreshToken,
      accountId,
      projectId,
    },
  });

  // if (token) {
  updateSelection();
  // }
});

figma.on("selectionchange", () => {
  updateSelection();
});

figma.ui.onmessage = async ({ type, data }: PluginMessage) => {
  console.log("[BACK]", type, data);
  switch (type) {
    case MessageType.SetAuth: {
      await figma.clientStorage.setAsync(
        "assetier-access-token",
        data.accessToken
      );
      await figma.clientStorage.setAsync(
        "assetier-refresh-token",
        data.refreshToken
      );

      break;
    }

    case MessageType.Setup: {
      setupAssetierGroup();
      break;
    }

    case MessageType.SetAccountProject: {
      figma.root.setPluginData("assetier-account-id", data.accountId);
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
          node.setPluginData("assetier.repo.assetPath", meta.assetPath);
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
