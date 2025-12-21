import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ScrollToHashHandler from "@/components/ScrollToHashHandler";
import PrismLoader from "@/utils/prism-loader";
import { ProjectHero } from "@/components/projects/ProjectHero";
import { ProjectNavigation } from "@/components/projects/ProjectNavigation";
import { TableOfContents } from "@/components/projects/TableOfContents";
import { configureMdx } from "@/lib/markdown/mdx-config";
import { mdxComponents } from "@/lib/markdown/MDXComponents";
import ProjectTracker from "@/components/projects/ProjectTracker";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;
/// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | zg0ul's Projects`,
    description: project.short_description,
    openGraph: {
      title: `${project.title} | zg0ul's Projects`,
      description: project.short_description,
      url: `https://zg0ul.com/projects/${project.slug}`,
      siteName: "zg0ul's Projects",
      images: [
        {
          url: `${project.featured_image}?width=1200&height=630&resize=cover&format=webp`,
          width: 1200,
          height: 630,
          alt: `${project.title} project showcase`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | zg0ul's Projects`,
      description: project.short_description,
      images: [
        `${project.featured_image}?width=1200&height=630&resize=cover&format=webp`,
      ],
    },
  };
}

export default async function ProjectPage({ params }: { params: Params }) {
  const supabase = await createClient();
  const { slug } = await params;

  // Fetch the current project
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !project) {
    notFound();
  }

  // Fetch other projects for navigation
  const { data: otherProjects } = await supabase
    .from("projects")
    .select("id, title, slug, featured_image")
    .neq("id", project.id)
    .eq("featured", true)
    .limit(2);

  return (
    <main className="topPageMargin relative container min-h-screen">
      {/* Add the tracker */}
      <ProjectTracker project={{ slug: project.slug, title: project.title }} />

      <ScrollToHashHandler />

      {/* Hero Section - Full width */}
      <div className="w-full">
        <ProjectHero project={project} />
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Content Layout */}
        <div className="relative">
          {/* Desktop Layout: Side-by-side */}
          <div className="lg:flex lg:items-start lg:gap-8 lg:self-start">
            {/* Main Content */}
            <article className="min-w-0 flex-1 lg:max-w-none">
              {/* Mobile: Full width content */}
              <div className="prose prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none">
                <div className="overflow-hidden break-words">
                  {configureMdx(project.long_description, mdxComponents)}
                </div>
              </div>
            </article>

            {/* Desktop Sidebar */}
            <aside className="aside hidden lg:inline-block lg:w-80">
              <TableOfContents content={project.long_description} />
            </aside>
          </div>

          {/* Mobile TOC - Floating bottom right */}
          <div className="fixed right-4 bottom-4 z-50 lg:hidden">
            <TableOfContents content={project.long_description} />
          </div>
        </div>

        {/* Related Projects Section */}
        {otherProjects && otherProjects.length > 0 && (
          <section className="mt-16 lg:mt-24">
            <h2 className="mb-6 text-2xl font-bold sm:text-3xl lg:mb-8">
              Other Projects
            </h2>
            <ProjectNavigation projects={otherProjects} />
          </section>
        )}
      </div>

      <PrismLoader />
    </main>
  );
}
