import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import ProjectsClient from "./projectsClient";
import ProjectCardSkeleton from "@/components/projects/ProjectCardSkeleton";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  // Server-side data fetching
  const supabase = await createClient();

  // Fetch all projects - this is cached by Next.js
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("end_date", { ascending: false }); // projects that were finished recently should be shown first

  if (error) {
    console.error("Error fetching projects:", error);
  }

  // Get unique categories for filtering (flatten all project categories)
  const categories = projects
    ? [...new Set(projects.flatMap((project) => project.categories || []))]
    : [];

  return (
    <main className="topPageMargin relative z-1 container mb-10 min-h-screen">
      <div className="">
        <div className="mb-8 text-center">
          <h1 className="section-title">Projects</h1>
          <p className="section-description">
            Explore my portfolio of projects across different technologies.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="min-h-[600px]">
              {" "}
              {/* Add minimum height */}
              {/* Category filter skeleton */}
              <div className="mb-8 flex flex-wrap justify-center gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={`filter-skeleton-${index}`}
                    className="bg-navy-700/50 h-10 w-20 animate-pulse rounded-full"
                  />
                ))}
              </div>
              {/* Project cards skeleton */}
              <ProjectCardSkeleton count={6} />
            </div>
          }
        >
          <div className="min-h-[600px]">
            {" "}
            {/* Match the fallback height */}
            <ProjectsClient
              initialProjects={projects || []}
              categories={categories}
            />
          </div>
        </Suspense>
      </div>
    </main>
  );
}
