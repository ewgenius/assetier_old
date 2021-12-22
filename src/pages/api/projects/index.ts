import type { Project } from "@prisma/client";
import { prisma } from "@utils/prisma";
import { withSession, ErrorResponse } from "@utils/withSession";

export default withSession<Project | Project[] | ErrorResponse>(
  async (req, res, session) => {
    switch (req.method) {
      case "GET": {
        const projects = await prisma.project.findMany({
          where: {
            user: {
              id: session?.userId,
            },
          },
        });
        return res.status(200).send(projects);
      }

      case "POST": {
        const newProject = await prisma.project.create({
          data: {
            name: req.body.name as string,
            userId: session.userId,
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
