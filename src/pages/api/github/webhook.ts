import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@utils/prisma";

interface WebhookPayload {
  action:
    | "created"
    | "deleted"
    | "suspend"
    | "unsuspend"
    | "new_permissions_accepted";
  installation: {
    id: number;
    account: {
      id: number;
      login: string;
      avatar_url: string;
      type: "Organization" | "User";
    };
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    action,
    installation: { id: installationId },
  } = req.body as WebhookPayload;

  switch (action) {
    case "deleted": {
      await prisma.githubInstallation.delete({
        where: {
          installationId,
        },
      });
      console.log(`GH ${installationId} deleted`);
      return res.status(200).json({});
    }
  }

  res.status(200).json({});
}
