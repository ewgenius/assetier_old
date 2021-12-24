import type { Project } from "@prisma/client";
import type { ErrorResponse } from "@utils/types";
import { prisma } from "@utils/prisma";
import { withOrganization } from "@utils/withOrganization";

export default withOrganization<Project | Project[] | ErrorResponse>(
  async (req, res, { organization }) => {
    switch (req.method) {
      case "GET": {
        const projects = await prisma.project.findMany({
          where: {
            organization,
          },
        });
        return res.status(200).send(projects);
      }

      case "POST": {
        const newProject = await prisma.project.create({
          data: {
            name: req.body.name as string,
            organizationId: organization.id,
            ...req.body,
          },
        });
        return res.status(200).json(newProject);
      }

      default: {
        return res.status(409).send({
          error: "Not Allowed",
        });
      }
    }
  }
);
