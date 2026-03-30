import { TechStack } from "@/components/projects/TechStack";
import { TableOfContents } from "@/components/projects/TableOfContents";
import { CategoriesWithIcons } from "@/components/ProjectCategories";

interface ProjectSidebarProps {
  project: {
    technologies: string[];
    categories: string[];
    start_date?: string;
    end_date?: string;
    created_at: string;
    long_description: string;
  };
}

export function ProjectSidebar({ project }: ProjectSidebarProps) {
  return (
    <aside className="lg:w-2/5 lg:max-w-md">
      {/* Project Details Card */}
      <div className="border-navy-600 bg-navy-800/50 mb-6 rounded-xl border p-6 shadow-lg backdrop-blur-sm">
        <h3 className="mb-4 text-xl font-bold">Tech Stack</h3>
        <TechStack technologies={project.technologies} />

        <div className="border-navy-600 my-6 border-t"></div>

        <h3 className="mb-4 text-xl font-bold">Project Details</h3>
        <dl className="space-y-4">
          <div>
            <dt className="text-sm text-gray-400">Categories</dt>
            <dd className="mt-1 font-medium">
              <CategoriesWithIcons categoryIds={project.categories} maxDisplay={3} showBadge={false} />
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-400">Timeline</dt>
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

      {/* 
        Table of Contents - Proper sticky positioning that works
        The key is using position sticky with proper top value and ensuring parent has height
      */}
      <div className="sticky top-4 hidden lg:block">
        <div className="border-navy-600 bg-navy-800/50 rounded-xl border p-6 shadow-lg backdrop-blur-sm">
          <TableOfContents content={project.long_description} />
        </div>
      </div>

      {/* Mobile TOC - Styled like mobile dock */}
      <div className="fixed right-4 bottom-4 z-50 lg:hidden">
        <TableOfContents content={project.long_description} />
      </div>
    </aside>
  );
}
