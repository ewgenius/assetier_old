import type { NextApiRequest, NextApiResponse } from "next";
import type { ErrorResponse, SessionWithId } from "@utils/types";
import type { Organization, Project, User } from "@prisma/client";
import { prisma } from "@utils/prisma";
import {
  withOrganization,
  NextApiRequestWithOrganization,
} from "@utils/withOrganization";
import { ForbiddenError, NotFoundError } from "./httpErrors";

export type NextApiRequestWithProject = NextApiRequestWithOrganization & {
  project: Project;
};

export type NextApiHandlerWithProject<T = any> = (
  req: NextApiRequestWithProject,
  res: NextApiResponse<T>
) => void | Promise<void>;

export const withProject = <T = any>(handler: NextApiHandlerWithProject<T>) =>
  withOrganization(async (req, res) => {
    const project = await prisma.project.findUnique({
      where: {
        id: req.query.projectId as string,
      },
    });

    if (!project) {
      throw new NotFoundError("Project not found.");
    }

    if (project.organizationId !== req.organization.id) {
      throw new ForbiddenError();
    }

    (req as NextApiRequestWithProject).project = project;

    return handler(req as NextApiRequestWithProject, res);
  });
