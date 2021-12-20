import type { NextApiRequest, NextApiResponse } from "next";
import type { Project } from "@prisma/client";
import { prisma } from "@utils/prisma";
import { withSession, ErrorResponse } from "@utils/withSession";

type Created = {
  name: string;
};

export default withSession<Created | Project[] | ErrorResponse>(
  async (req, res, session) => {
    if (req.method === "POST") {
      res.status(200).json({ name: "John Doe" });
    } else if (req.method === "GET") {
      const projects = await prisma.project.findMany({
        where: {
          user: {
            id: session?.userId,
          },
        },
      });
      res.status(200).send(projects);
    }

    res.status(409).send({
      error: "Not Allowed",
    });
  }
);
