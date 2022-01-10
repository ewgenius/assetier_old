import type { Project } from "lib-prisma";

import { prisma } from "@utils/prisma";
import { NotFoundError } from "@utils/httpErrors";

export async function getProjectInstallation(project: Project) {
  const installation = await prisma.githubInstallation.findUnique({
    where: {
      id: project.githubInstallationId,
    },
  });

  if (!installation) {
    throw new NotFoundError("GH Installation not found");
  }

  return installation;
}
