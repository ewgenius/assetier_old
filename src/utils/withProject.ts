import type { NextApiRequest, NextApiResponse } from "next";
import type { ErrorResponse, SessionWithId } from "@utils/types";
import type { Organization, Project, User } from "@prisma/client";
import { prisma } from "@utils/prisma";
import { withOrganization } from "@utils/withOrganization";

export type NextApiHandlerWithProject<T = any> = (
  req: NextApiRequest,
  res: NextApiResponse<T>,
  context: {
    session: SessionWithId;
    user: User;
    organization: Organization;
    project: Project;
  }
) => void | Promise<void>;

export const withProject = <T = any>(handler: NextApiHandlerWithProject<T>) =>
  withOrganization(async (req, res, { session, user, organization }) => {
    const project = await prisma.project.findUnique({
      where: {
        id: req.query.projectId as string,
      },
    });

    if (!project) {
      return res.status(404).send({
        error: "Project not found.",
      });
    }

    if (project.organizationId !== organization.id) {
      return res.status(403).send({
        error: "Unauthorized",
      });
    }

    return handler(req, res, { session, user, organization, project });
  });
