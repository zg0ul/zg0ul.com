"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { SiGithub } from "react-icons/si";
import * as motion from "motion/react-client";
import { ProjectDetails } from "@/components/projects/ProjectDetails";
import { usePageTracking } from "@/components/AnalyticsTracker";

interface ProjectHeroProps {
  project: {
    featured_image: string;
    title: string;
    categories: string[];
    short_description: string;
    github_url?: string;
    live_url?: string;
    technologies: string[];
    start_date?: string;
    end_date?: string;
    created_at: string;
  };
}

export function ProjectHero({ project }: ProjectHeroProps) {
  const { trackExternalLink, trackCustomEvent } = usePageTracking();

  const handleExternalLinkClick = (type: "github" | "live", url: string) => {
    trackExternalLink(url, `${project.title} - ${type}`);
    trackCustomEvent("project_external_link_click", {
      project_title: project.title,
      link_type: type,
      url: url,
      source: "project_hero",
    });
  };

  return (
    <div className="relative w-full">
      {/* Header with Back Button and Title */}
      <div className="mb-4 flex items-center justify-between">
        {/* Back Button - Desktop only */}
        <Link
          href="/projects"
          className="bg-navy-800/90 border-navy-600 hover:bg-navy-700/90 hover:text-neon group hidden items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium backdrop-blur-sm transition-all lg:flex"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Projects
        </Link>

        {/* Title - Centered on mobile, right-aligned on desktop */}
        <h1 className="text-neon-4 mx-auto text-3xl font-bold tracking-tight whitespace-nowrap sm:text-4xl md:text-5xl lg:mx-0">
          {project.title}
        </h1>

        {/* Empty space for balance on desktop */}
        <div className="hidden lg:block lg:w-[140px]"></div>
      </div>

      {/* Centered Description */}
      <div className="mb-8 text-center">
        <p className="text-foreground mx-auto max-w-3xl text-sm md:text-lg lg:text-xl">
          {project.short_description}
        </p>
      </div>

      {/* Image and Project Details Layout - Equal Heights */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-8">
        {/* Hero Image - Takes up more space (2/3) */}
        <div className="relative aspect-video w-full lg:flex-[2]">
          <Image
            src={project.featured_image}
            alt={project.title}
            fill
            className="border-navy-700 overflow-clip rounded-lg border object-cover"
            priority
          />
        </div>

        {/* Project Details Card - Takes up less space (1/3) */}
        <div className="flex lg:flex-1">
          <ProjectDetails
            project={project}
            actionButtons={
              project.github_url || project.live_url ? (
                <div className="flex flex-wrap gap-3">
                  {project.github_url && (
                    <Link
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        handleExternalLinkClick("github", project.github_url!)
                      }
                      className="group border-navy-400 bg-navy-700/50 hover:border-neon/40 hover:bg-navy-600/50 hover:text-neon flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all"
                    >
                      <SiGithub className="h-4 w-4 transition-transform group-hover:scale-110" />
                      View Code
                    </Link>
                  )}
                  {project.live_url && (
                    <Link
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        handleExternalLinkClick("live", project.live_url!)
                      }
                      className="group border-navy-400 bg-navy-700/50 hover:border-neon/40 hover:bg-navy-600/50 hover:text-neon flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all"
                    >
                      <ExternalLink className="h-4 w-4 transition-transform group-hover:scale-110" />
                      Live Demo
                    </Link>
                  )}
                </div>
              ) : undefined
            }
          />
        </div>
      </div>

      {/* Floating Back Button - Mobile only */}
      <div className="fixed bottom-4 left-4 z-50 lg:hidden">
        <Link href="/projects">
          <motion.button
            className="bg-navy-800/90 border-navy-600 hover:bg-navy-700/90 flex h-12 w-12 items-center justify-center rounded-2xl border shadow-lg backdrop-blur-sm"
            aria-label="Back to All Projects"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="text-foreground h-5 w-5" />
          </motion.button>
        </Link>
      </div>
    </div>
  );
}
