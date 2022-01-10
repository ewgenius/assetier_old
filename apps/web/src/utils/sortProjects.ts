import type { Project } from "lib-prisma";

export function sortProjects(projectA: Project, projectB: Project) {
  return (
    new Date(projectB.createdAt).getTime() -
    new Date(projectA.createdAt).getTime()
  );
}
