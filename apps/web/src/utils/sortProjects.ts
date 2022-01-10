import type { Project } from "@prisma/client";

export function sortProjects(projectA: Project, projectB: Project) {
  return (
    new Date(projectB.createdAt).getTime() -
    new Date(projectA.createdAt).getTime()
  );
}
