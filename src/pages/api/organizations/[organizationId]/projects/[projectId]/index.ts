import type { Project } from "@prisma/client";
import { NotAllowedError } from "@utils/httpErrors";
import { prisma } from "@utils/prisma";
import { withProject } from "@utils/withProject";

export default withProject<Project>(async ({ method, body, project }, res) => {
  switch (method) {
    case "GET": {
      return res.status(200).send(project);
    }

    case "PATCH": {
      const updatedProject = await prisma.project.update({
        where: {
          id: project.id,
        },
        data: body,
      });
      return res.status(200).send(updatedProject);
    }

    default: {
      throw new NotAllowedError();
    }
  }
});
