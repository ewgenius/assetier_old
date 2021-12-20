import type { NextApiRequest, NextApiResponse } from "next";
import type { Project } from "@prisma/client";
import { prisma } from "@utils/prisma";
import { withSession, ErrorResponse } from "@utils/withSession";

type Created = {
  name: string;
};

export default withSession<Created | Project[] | ErrorResponse>(
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
        return res.status(200).json({ name: "John Doe" });
      }

      default: {
        return res.status(409).send({
          error: "Not Allowed",
        });
      }
    }
  }
);
