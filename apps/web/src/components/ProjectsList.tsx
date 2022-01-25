import { sortProjects } from "@utils/sortProjects";
import { useProjects } from "@hooks/useProjects";
import { Spinner } from "@components/Spinner";
import { ProjectCard } from "@components/ProjectCard";

export const ProjectsList = () => {
  const { projects } = useProjects();
  return projects ? (
    <ul
      role="list"
      className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
    >
      {Object.values(projects)
        .filter((p) => !!p)
        .sort(sortProjects)
        .map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
    </ul>
  ) : (
    <div className="flex justify-center py-4">
      <Spinner />
    </div>
  );
};
