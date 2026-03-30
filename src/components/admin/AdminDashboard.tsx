"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as motion from "motion/react-client";
import {
  PlusCircle,
  FolderOpen,
  Star,
  TrendingUp,
  Calendar,
  LogOut,
  Settings,
  Eye,
  Edit3,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BentoCard } from "@/components/ui/bento-card";
import { AnimatedCard } from "@/components/ui/animated_card";

interface DashboardData {
  stats: {
    totalProjects: number;
    featuredProjects: number;
    categories: number;
    lastUpdated: string;
  };
  recentProjects: Array<{
    id: string;
    title: string;
    created_at: string;
    categories: string[];
    featured: boolean;
  }>;
  categoryStats: Record<string, number>;
}

interface AdminDashboardProps {
  data: DashboardData;
}

export default function AdminDashboard({ data }: AdminDashboardProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });

      if (response.ok) {
        toast.success("Logged out successfully");
        router.push("/");
        router.refresh();
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="topPageMargin bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-foreground text-3xl font-bold">
              Admin Dashboard
            </h1>
            <p className="text-navy-200 mt-1">
              Welcome back! Manage your portfolio content.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" target="_blank">
              <Button
                variant="outline"
                size="sm"
                className="border-navy-600 bg-navy-700/50 hover:bg-navy-600"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Site
              </Button>
            </Link>

            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              variant="ghost"
              size="sm"
              className="text-red-400 hover:bg-red-900/20 hover:text-red-300"
            >
              {isLoggingOut ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="mr-2"
                  >
                    <Settings className="h-4 w-4" />
                  </motion.div>
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Projects */}
          <BentoCard className="relative overflow-hidden">
            <div className="flex items-center justify-between p-6">
              <div>
                <p className="text-navy-400 text-sm font-medium">
                  Total Projects
                </p>
                <p className="text-foreground text-3xl font-bold">
                  {data.stats.totalProjects}
                </p>
              </div>
              <div className="bg-neon/20 border-neon/30 flex h-12 w-12 items-center justify-center rounded-full border">
                <FolderOpen className="text-neon h-6 w-6" />
              </div>
            </div>
          </BentoCard>

          {/* Featured Projects */}
          <BentoCard className="relative overflow-hidden">
            <div className="flex items-center justify-between p-6">
              <div>
                <p className="text-navy-400 text-sm font-medium">Featured</p>
                <p className="text-foreground text-3xl font-bold">
                  {data.stats.featuredProjects}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-yellow-500/30 bg-yellow-500/20">
                <Star className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </BentoCard>

          {/* Categories */}
          <BentoCard className="relative overflow-hidden">
            <div className="flex items-center justify-between p-6">
              <div>
                <p className="text-navy-400 text-sm font-medium">Categories</p>
                <p className="text-foreground text-3xl font-bold">
                  {data.stats.categories}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/20">
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </BentoCard>

          {/* Last Updated */}
          <BentoCard className="relative overflow-hidden">
            <div className="flex items-center justify-between p-6">
              <div>
                <p className="text-navy-400 text-sm font-medium">
                  Last Updated
                </p>
                <p className="text-foreground text-sm font-medium">
                  {formatDate(data.stats.lastUpdated)}
                </p>
                <p className="text-navy-400 text-xs">
                  {formatTime(data.stats.lastUpdated)}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/20">
                <Calendar className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </BentoCard>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <AnimatedCard
              title="Quick Actions"
              description="Common administrative tasks"
              className="h-full p-6"
            >
              <div className="space-y-3">
                <Link href="/admin/projects/editor" className="block">
                  <Button className="from-neon to-neon-4 hover:from-neon-4 hover:to-neon text-navy-800 w-full justify-start bg-gradient-to-r">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Project
                  </Button>
                </Link>

                <Link href="/admin/projects" className="block">
                  <Button
                    variant="outline"
                    className="border-navy-600 bg-navy-700/50 hover:bg-navy-600 w-full justify-start"
                  >
                    <Edit3 className="mr-2 h-4 w-4" />
                    Manage Projects
                  </Button>
                </Link>

                <Link href="/admin/analytics" className="block">
                  <Button
                    variant="outline"
                    className="border-navy-600 bg-navy-700/50 hover:bg-navy-600 w-full justify-start"
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                </Link>

                <Link href="/projects" target="_blank" className="block">
                  <Button
                    variant="ghost"
                    className="hover:bg-navy-700/50 w-full justify-start"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview Portfolio
                  </Button>
                </Link>
              </div>
            </AnimatedCard>
          </div>

          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <AnimatedCard
              title="Recent Projects"
              description="Your latest portfolio additions"
              className="h-full p-6"
            >
              {data.recentProjects.length > 0 ? (
                <div className="space-y-3">
                  {data.recentProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-navy-600 bg-navy-700/30 hover:bg-navy-700/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-foreground font-medium">
                            {project.title}
                          </h4>
                          {project.featured && (
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          )}
                        </div>
                        <div className="text-navy-400 mt-1 flex items-center gap-2 text-sm">
                          <span>{project.categories?.join(", ") || "Uncategorized"}</span>
                          <span>•</span>
                          <span>{formatDate(project.created_at)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/projects/${project.id}`} target="_blank">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/projects/editor/${project.id}`}>
                          <Button size="sm" variant="ghost">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Users className="text-navy-400 mx-auto mb-4 h-12 w-12" />
                  <p className="text-navy-300">No projects yet</p>
                  <p className="text-navy-400 mt-1 text-sm">
                    Create your first project to get started
                  </p>
                </div>
              )}
            </AnimatedCard>
          </div>
        </div>

        {/* Category Stats */}
        {Object.keys(data.categoryStats).length > 0 && (
          <div className="mt-6">
            <AnimatedCard
              title="Projects by Category"
              description="Distribution of your portfolio projects"
              className="p-6"
            >
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {Object.entries(data.categoryStats).map(([category, count]) => (
                  <div
                    key={category}
                    className="border-navy-600 bg-navy-700/30 rounded-lg border p-4 text-center"
                  >
                    <p className="text-foreground text-2xl font-bold">
                      {count}
                    </p>
                    <p className="text-navy-400 text-sm">{category}</p>
                  </div>
                ))}
              </div>
            </AnimatedCard>
          </div>
        )}
      </div>
    </main>
  );
}
