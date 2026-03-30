// src/components/admin/AdminProjectTable.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as motion from "motion/react-client";
import {
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  Star,
  Calendar,
  Tag,
  ExternalLink,
  Github,
  MoreHorizontal,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoriesWithIcons } from "@/components/ProjectCategories";
import { toast } from "sonner";

interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  featured_image: string;
  categories: string[];
  technologies: string[];
  github_url?: string;
  live_url?: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

interface AdminProjectTableProps {
  projects: Project[];
}

export function AdminProjectTable({
  projects: initialProjects,
}: AdminProjectTableProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const router = useRouter();

  // Get unique categories for filter
  const categories = [...new Set(projects.flatMap((p) => p.categories || []))];

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.short_description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || project.categories?.includes(categoryFilter);
    return matchesSearch && matchesCategory;
  });

  // Sort projects by creation date (newest first)
  const sortedProjects = [...filteredProjects].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const handleDelete = async (id: string, title: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setIsDeleting(id);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete project");
      }

      // Remove project from local state
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success(`"${title}" has been deleted`);
      router.refresh();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Delete error:", error);
      setDeleteError(error.message);
      toast.error(`Failed to delete "${title}"`);
    } finally {
      setIsDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6">
      {/* Search and Filter Controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative max-w-md flex-1">
          <Search className="text-navy-400 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-navy-700/50 border-navy-600 focus:border-neon focus:ring-neon/20 text-foreground placeholder-navy-400 w-full rounded-lg border py-2 pr-4 pl-10 transition-colors focus:ring-2 focus:outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="text-navy-400 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-navy-700/50 border-navy-600 focus:border-neon focus:ring-neon/20 text-foreground appearance-none rounded-lg border py-2 pr-8 pl-10 transition-colors focus:ring-2 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="text-navy-400 text-sm">
            {sortedProjects.length} of {projects.length} projects
          </div>
        </div>
      </div>

      {/* Error Message */}
      {deleteError && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-700/50 bg-red-900/20 p-4 text-red-400">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error deleting project</p>
            <p className="text-sm">{deleteError}</p>
          </div>
        </div>
      )}

      {/* Projects Grid/List */}
      {sortedProjects.length > 0 ? (
        <div className="space-y-4">
          {sortedProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group border-navy-600 bg-navy-700/30 hover:bg-navy-700/50 rounded-xl border p-4 transition-all duration-300"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* Project Image */}
                <div className="relative h-20 w-full flex-shrink-0 overflow-hidden rounded-lg sm:w-32">
                  <Image
                    src={project.featured_image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 128px"
                  />
                </div>

                {/* Project Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="text-foreground truncate font-semibold">
                          {project.title}
                        </h3>
                        {project.featured && (
                          <Star className="h-4 w-4 flex-shrink-0 fill-yellow-400 text-yellow-400" />
                        )}
                      </div>

                      <p className="text-navy-300 mb-2 line-clamp-2 text-sm">
                        {project.short_description}
                      </p>

                      <div className="text-navy-400 flex flex-wrap items-center gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          <CategoriesWithIcons categoryIds={project.categories} maxDisplay={2} />
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(project.created_at)}
                        </div>
                        <span>•</span>
                        <span>{project.technologies.length} technologies</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-shrink-0 items-center gap-2">
                      {/* External Links */}
                      <div className="hidden items-center gap-1 sm:flex">
                        {project.live_url && (
                          <Link href={project.live_url} target="_blank">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="hover:bg-navy-600 h-8 w-8 p-0"
                              title="View Live Demo"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}

                        {project.github_url && (
                          <Link href={project.github_url} target="_blank">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="hover:bg-navy-600 h-8 w-8 p-0"
                              title="View Source Code"
                            >
                              <Github className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                      </div>

                      {/* Admin Actions */}
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/projects/${project.slug}`}
                          target="_blank"
                        >
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-blue-900/30 hover:text-blue-400"
                            title="Preview Project"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>

                        <Link href={`/admin/projects/editor/${project.id}`}>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-yellow-900/30 hover:text-yellow-400"
                            title="Edit Project"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </Link>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleDelete(project.id, project.title)
                          }
                          disabled={isDeleting === project.id}
                          className="h-8 w-8 p-0 hover:bg-red-900/30 hover:text-red-400 disabled:opacity-50"
                          title="Delete Project"
                        >
                          {isDeleting === project.id ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </motion.div>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <div className="bg-navy-700/30 border-navy-600 mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed">
            <Search className="text-navy-400 h-8 w-8" />
          </div>
          <h3 className="text-foreground mb-2 text-lg font-medium">
            {searchTerm || categoryFilter !== "all"
              ? "No matching projects"
              : "No projects found"}
          </h3>
          <p className="text-navy-400 mb-4">
            {searchTerm || categoryFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Get started by creating your first project"}
          </p>
          {!searchTerm && categoryFilter === "all" && (
            <Link href="/admin/projects/editor">
              <Button className="from-neon to-neon-4 hover:from-neon-4 hover:to-neon text-navy-900 bg-gradient-to-r">
                Create Your First Project
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
