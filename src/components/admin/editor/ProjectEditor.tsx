"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectType } from "@/types/project";
import { toast } from "sonner";

// Import new components
import BasicInformationForm from "@/components/admin/editor/BasicInformationForm";
import ProjectLinksForm from "@/components/admin/editor/ProjectLinksForm";
import ProjectDescriptionForm from "@/components/admin/editor/ProjectDescriptionForm";
import FeaturedImageUpload from "@/components/admin/editor/FeaturedImageUpload";
import CategorySelector from "@/components/admin/editor/CategorySelector";
import TechnologySelector from "@/components/admin/editor/TechnologySelector";
import ProjectSettings from "@/components/admin/editor/ProjectSettings";

interface ProjectEditorProps {
  project?: ProjectType | null;
  isEditing: boolean;
}

export default function ProjectEditor({
  project,
  isEditing,
}: ProjectEditorProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<ProjectType>({
    title: "",
    slug: "",
    short_description: "",
    long_description: "",
    featured_image: "",
    github_url: "",
    live_url: "",
    categories: [],
    technologies: [],
    gallery_images: [],
    start_date: "",
    end_date: "",
    featured: false,
    ...project,
  });

  // Fix: Use useCallback to prevent re-creating the slug generation function
  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");
  }, []);

  // Auto-generate slug from title (fixed)
  useEffect(() => {
    if (!isEditing && formData.title) {
      const newSlug = generateSlug(formData.title);
      setFormData((prev) => ({ ...prev, slug: newSlug }));
    }
  }, [formData.title, isEditing, generateSlug]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleTechnologiesChange = (technologies: string[]) => {
    setFormData((prev) => ({ ...prev, technologies }));

    // Clear technology error if exists
    if (errors.technologies) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.technologies;
        return newErrors;
      });
    }
  };

  const handleCategoriesChange = (categories: string[]) => {
    setFormData((prev) => ({ ...prev, categories }));

    // Clear categories error if exists
    if (errors.categories) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.categories;
        return newErrors;
      });
    }
  };

  const handleFeaturedImageChange = (url: string) => {
    setFormData((prev) => ({ ...prev, featured_image: url }));

    // Clear featured_image error if exists
    if (errors.featured_image) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.featured_image;
        return newErrors;
      });
    }
  };

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, long_description: value }));

    // Clear long_description error if exists
    if (errors.long_description) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.long_description;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    if (!formData.short_description.trim())
      newErrors.short_description = "Short description is required";
    if (!formData.long_description.trim())
      newErrors.long_description = "Long description is required";
    if (formData.categories.length === 0)
      newErrors.categories = "At least one category is required";
    if (!formData.featured_image)
      newErrors.featured_image = "Featured image is required";
    if (formData.technologies.length === 0)
      newErrors.technologies = "At least one technology is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setIsSaving(true);
    try {
      const endpoint = isEditing
        ? `/api/projects/${project!.id}`
        : "/api/projects/create";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          updated_at: new Date().toISOString(),
          ...(isEditing ? {} : { created_at: new Date().toISOString() }),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save project");
      }

      toast.success(isEditing ? "Project updated!" : "Project created!");
      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save project",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="topPageMargin bg-background min-h-screen">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-6 flex items-center gap-4">
            <Link href="/admin/projects">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:bg-navy-700/50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Button>
            </Link>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-foreground text-3xl font-bold">
                {isEditing ? "Edit Project" : "Create New Project"}
              </h1>
              <p className="text-navy-200 mt-1">
                {isEditing
                  ? `Editing: ${project?.title}`
                  : "Add a new project to your portfolio"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {isEditing && formData.slug && (
                <Link href={`/projects/${formData.slug}`} target="_blank">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-navy-600 bg-navy-700/50 hover:bg-navy-600"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                </Link>
              )}

              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="from-neon to-neon-4 hover:from-neon-4 hover:to-neon text-navy-800 bg-gradient-to-r"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditing ? "Update" : "Create"} Project
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Basic Information */}
            <BasicInformationForm
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
              isEditing={isEditing}
            />

            {/* Project Links */}
            <ProjectLinksForm
              formData={formData}
              onInputChange={handleInputChange}
            />

            {/* Long Description */}
            <ProjectDescriptionForm
              value={formData.long_description}
              error={errors.long_description}
              onChange={handleDescriptionChange}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Image */}
            <FeaturedImageUpload
              value={formData.featured_image}
              error={errors.featured_image}
              onChange={handleFeaturedImageChange}
            />

            {/* Categories */}
            <CategorySelector
              value={formData.categories}
              error={errors.categories}
              onChange={handleCategoriesChange}
            />

            {/* Technologies */}
            <TechnologySelector
              value={formData.technologies}
              error={errors.technologies}
              onChange={handleTechnologiesChange}
            />

            {/* Project Settings */}
            <ProjectSettings
              formData={formData}
              onInputChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
