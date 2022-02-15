import { prisma } from "@utils/prisma";
import { ForbiddenError, NotFoundError } from "./httpErrors";

export async function getAccountProject(accountId: string, projectId: string) {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId as string,
    },
  });

  if (!project) {
    throw new NotFoundError("Project not found.");
  }

  if (project.accountId !== accountId) {
    throw new ForbiddenError();
  }

  return project;
}
