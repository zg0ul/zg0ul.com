"use client";

import { useState } from "react";
import ProjectCard from "@/components/projects/ProjectCard";
import { CategoryFilter } from "@/components/projects/CategoryFilter";
import { ProjectType } from "@/types/project";

interface ProjectsClientProps {
  initialProjects: ProjectType[];
  categories: string[];
}

export default function ProjectsClient({
  initialProjects,
  categories,
}: ProjectsClientProps) {
  // State to track the currently active category
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Filter projects based on the selected category
  const filteredProjects = activeCategory
    ? initialProjects.filter((project) => project.categories?.includes(activeCategory))
    : initialProjects;

  return (
    <>
      {/* Category filter component */}
      <CategoryFilter
        categories={categories}
        onCategoryChange={setActiveCategory}
        activeCategory={activeCategory}
      />

      {/* Projects grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 px-3 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project: ProjectType) => (
          <ProjectCard key={project.id} project={project} />
        ))}

        {filteredProjects.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <h3 className="text-text-600 text-xl">No projects found</h3>
            <p className="text-text-600/50 mt-2">
              Try changing your filter criteria
            </p>
          </div>
        )}
      </div>
    </>
  );
}
