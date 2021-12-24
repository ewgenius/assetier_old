import type { Project } from "@prisma/client";
import { ErrorResponse } from "@utils/types";
import { withProject } from "@utils/withProject";

export default withProject<Project | null | ErrorResponse>(
  async (req, res, { project }) => {
    switch (req.method) {
      case "GET": {
        return res.status(200).send(project);
      }

      default: {
        return res.status(409).send({
          error: "Not Allowed",
        });
      }
    }
  }
);
