import { createAdminClient } from "@/lib/supabase/admin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { checkAdminAuth } from "@/lib/admin-auth";

export const metadata = {
  title: "Admin Dashboard - zg0ul",
  description: "Portfolio management dashboard",
};

async function AdminPage() {
  await checkAdminAuth();
  // Fetch dashboard statistics
  const adminClient = createAdminClient();

  try {
    // Get projects count
    const { count: projectsCount } = await adminClient
      .from("projects")
      .select("*", { count: "exact", head: true });

    // Get featured projects count
    const { count: featuredCount } = await adminClient
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("featured", true);

    // Get recent projects
    const { data: recentProjects } = await adminClient
      .from("projects")
      .select("id, title, created_at, categories, featured")
      .order("created_at", { ascending: false })
      .limit(5);

    // Get projects by category
    const { data: projectsByCategory } = await adminClient
      .from("projects")
      .select("categories");

    // Count categories (each project can have multiple)
    const categoryStats =
      projectsByCategory?.reduce(
        (acc, project) => {
          const categories = project.categories || [];
          categories.forEach((cat: string) => {
            acc[cat] = (acc[cat] || 0) + 1;
          });
          return acc;
        },
        {} as Record<string, number>,
      ) || {};

    const dashboardData = {
      stats: {
        totalProjects: projectsCount || 0,
        featuredProjects: featuredCount || 0,
        categories: Object.keys(categoryStats).length,
        lastUpdated: new Date().toISOString(),
      },
      recentProjects: recentProjects || [],
      categoryStats,
    };

    return <AdminDashboard data={dashboardData} />;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);

    // Return dashboard with empty data on error
    return (
      <AdminDashboard
        data={{
          stats: {
            totalProjects: 0,
            featuredProjects: 0,
            categories: 0,
            lastUpdated: new Date().toISOString(),
          },
          recentProjects: [],
          categoryStats: {},
        }}
      />
    );
  }
}

export default AdminPage;
