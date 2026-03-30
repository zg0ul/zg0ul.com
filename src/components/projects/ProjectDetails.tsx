import { TechStack } from "@/components/projects/TechStack";
import { CategoriesWithIcons } from "@/components/ProjectCategories";

interface ProjectDetailsProps {
  project: {
    technologies: string[];
    categories: string[];
    start_date?: string;
    end_date?: string;
    created_at: string;
  };
  actionButtons?: React.ReactNode;
}

export function ProjectDetails({
  project,
  actionButtons,
}: ProjectDetailsProps) {
  return (
    <div className="border-navy-600 bg-navy-800/50 flex h-full w-full flex-col rounded-xl border p-6 shadow-lg backdrop-blur-sm">
      {/* Project Links at the top - only show if buttons exist */}
      {actionButtons && (
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-bold">Links</h3>
          {actionButtons}
        </div>
      )}

      {/* Tech Stack Section */}
      <div className="mb-6">
        <h3 className="mb-4 text-xl font-bold">Tech Stack</h3>
        <TechStack technologies={project.technologies} />
      </div>

      <div className="border-navy-600 border-t"></div>

      {/* Project Details Section - grows to fill remaining space */}
      <div className="mt-6 flex-1">
        <h3 className="mb-4 text-xl font-bold">Project Details</h3>
        <dl className="space-y-4">
          <div>
            <dt className="text-navy-200 text-sm">Categories</dt>
            <dd className="mt-1 font-medium">
              <CategoriesWithIcons categoryIds={project.categories} maxDisplay={3} showBadge={false} />
            </dd>
          </div>
          <div>
            <dt className="text-navy-200 text-sm">Timeline</dt>
            <dd className="mt-1 font-medium">
              {project.start_date ? (
                <>
                  {new Date(project.start_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                  {" - "}
                  {project.end_date
                    ? new Date(project.end_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })
                    : "Present"}
                </>
              ) : (
                new Date(project.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })
              )}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
