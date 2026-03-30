/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X, Plus } from "lucide-react";
import EnhancedMarkdownEditor from "@/components/admin/MarkdownEditor";
import {
  PROJECT_CATEGORIES,
  CategoriesWithIcons,
} from "@/components/ProjectCategories";
import { TECHNOLOGIES, TechnologyWithIcon } from "@/components/TechIcons";
import { ProjectType } from "@/types/project";

interface ProjectFormProps {
  project?: ProjectType;
  isEditing?: boolean;
}

export function ProjectForm({ project, isEditing = false }: ProjectFormProps) {
  const router = useRouter();

  // Form state
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
    ...project,
  });

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [success, setSuccess] = useState<string | null>(null);
  const [techDropdownOpen, setTechDropdownOpen] = useState(false);

  // File upload states
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [galleryFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Generate slug from title
  useEffect(() => {
    if (!isEditing && formData.title && !formData.slug) {
      setFormData({
        ...formData,
        slug: formData.title
          .toLowerCase()
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "-"),
      });
    }
  }, [formData.title, isEditing, formData.slug, formData]);

  // Close tech dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#tech-dropdown-container")) {
        setTechDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle markdown editor changes
  const handleMarkdownChange = (value: string) => {
    setFormData({ ...formData, long_description: value });

    // Clear validation error when markdown is edited
    if (validationErrors["long_description"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors["long_description"];
        return newErrors;
      });
    }
  };

  // Handle technology selection
  const handleToggleTech = (techId: string) => {
    const techExists = formData.technologies.includes(techId);

    if (techExists) {
      // Remove technology if already selected
      setFormData({
        ...formData,
        technologies: formData.technologies.filter(
          (id: string) => id !== techId,
        ),
      });
    } else {
      // Add technology if not already selected
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techId],
      });
    }

    // Clear validation error when technologies are updated
    if (validationErrors["technologies"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors["technologies"];
        return newErrors;
      });
    }
  };

  // Handle category selection (toggle)
  const handleCategoryChange = (categoryId: string) => {
    const newCategories = formData.categories.includes(categoryId)
      ? formData.categories.filter((id) => id !== categoryId)
      : [...formData.categories, categoryId];
    setFormData({ ...formData, categories: newCategories });

    // Clear validation error when categories is updated
    if (validationErrors["categories"]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors["categories"];
        return newErrors;
      });
    }
  };

  // Handle featured image upload
  const handleFeaturedImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFeaturedImageFile(file);
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);

      // Clear validation error when image is selected
      if (validationErrors["featured_image"]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors["featured_image"];
          return newErrors;
        });
      }
    }
  };

  // Validate form data
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.slug.trim()) {
      errors.slug = "Slug is required";
    }

    if (!formData.short_description.trim()) {
      errors.short_description = "Short description is required";
    }

    if (formData.categories.length === 0) {
      errors.categories = "At least one category is required";
    }

    if (!formData.featured_image && !imagePreviewUrl) {
      errors.featured_image = "Featured image is required";
    }

    if (!formData.long_description.trim()) {
      errors.long_description = "Long description is required";
    }

    if (formData.technologies.length === 0) {
      errors.technologies = "At least one technology is required";
    }

    return errors;
  };

  // Upload files to Supabase Storage using API endpoints
  const uploadFiles = async () => {
    try {
      let featuredImageUrl = formData.featured_image;
      let galleryImageUrls = [...formData.gallery_images];

      // Upload featured image if changed
      if (featuredImageFile) {
        const uploadData = new FormData();
        uploadData.append("file", featuredImageFile);

        const response = await fetch("/api/upload/content-image", {
          method: "POST",
          body: uploadData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Featured image upload error:", errorData);
          throw new Error(
            errorData.message ||
              errorData.details ||
              errorData.error ||
              `Failed to upload featured image: ${response.status} ${response.statusText}`,
          );
        }

        const data = await response.json();
        featuredImageUrl = data.url;
        setUploadProgress(50);
      }

      // Upload gallery images if any
      if (galleryFiles.length > 0) {
        const newUrls = [];

        for (let i = 0; i < galleryFiles.length; i++) {
          const file = galleryFiles[i];
          const uploadData = new FormData();
          uploadData.append("file", file);

          const response = await fetch("/api/upload/content-image", {
            method: "POST",
            body: uploadData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error(`Gallery image ${i + 1} upload error:`, errorData);
            throw new Error(
              errorData.message ||
                errorData.details ||
                errorData.error ||
                `Failed to upload gallery image ${i + 1}: ${response.status} ${response.statusText}`,
            );
          }

          const data = await response.json();
          newUrls.push(data.url);
          setUploadProgress(
            50 + Math.floor(((i + 1) / galleryFiles.length) * 50),
          );
        }

        galleryImageUrls = [...galleryImageUrls, ...newUrls];
      }

      return {
        featured_image: featuredImageUrl,
        gallery_images: galleryImageUrls,
      };
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    setValidationErrors({});

    try {
      // Validate form data
      const errors = validateForm();

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        throw new Error("Please fill in all required fields");
      }

      // Upload files if any
      let uploadedUrls = {
        featured_image: formData.featured_image,
        gallery_images: formData.gallery_images,
      };

      if (featuredImageFile || galleryFiles.length > 0) {
        uploadedUrls = await uploadFiles();
      }

      // Prepare data for API
      const projectData = {
        ...formData,
        featured_image: uploadedUrls.featured_image,
        gallery_images: uploadedUrls.gallery_images,
        updated_at: new Date().toISOString(),
      };

      // Add or update project using API routes
      if (isEditing && project?.id) {
        // Update existing project using the API route
        const response = await fetch(`/api/projects/${project.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(projectData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update project");
        }

        setSuccess("Project updated successfully!");
        router.refresh();
      } else {
        // Create new project using the API route
        const response = await fetch("/api/projects/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...projectData,
            created_at: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create project");
        }

        setSuccess("Project created successfully!");
        router.push("/admin/projects");
      }
    } catch (error: any) {
      console.error("Error saving project:", error);
      setError(error.message || "An error occurred while saving the project");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="relative z-1 mx-auto w-full max-w-4xl">
      <div className="absolute inset-0 overflow-hidden mask-t-from-50% opacity-30">
        <div className="from-neon/20 absolute inset-x-0 top-0 h-40 bg-gradient-to-b to-transparent blur-2xl"></div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-navy-600 bg-navy-800/50 relative space-y-8 rounded-xl border p-6 shadow-lg backdrop-blur-sm"
      >
        {error && (
          <div className="rounded-lg border border-red-800/40 bg-red-950/20 p-4 text-red-400">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-800/30 p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>
              <p className="body-medium text-sm">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-green-800/40 bg-green-950/20 p-4 text-green-400">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-800/30 p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="body-medium text-sm">{success}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Title */}
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-foreground block text-sm font-medium"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`body border-navy-600 bg-navy-700/50 text-foreground focus:border-neon focus:ring-neon/20 focus:ring-opacity-50 w-full rounded-lg border p-3 placeholder-gray-400 shadow-sm focus:ring ${
                validationErrors.title ? "border-red-500" : ""
              }`}
              required
            />
            {validationErrors.title && (
              <p className="mt-1 text-xs text-red-500">
                {validationErrors.title}
              </p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <label
              htmlFor="slug"
              className="text-foreground block text-sm font-medium"
            >
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className={`body border-navy-600 bg-navy-700/50 text-foreground focus:border-neon focus:ring-neon/20 focus:ring-opacity-50 w-full rounded-lg border p-3 placeholder-gray-400 shadow-sm focus:ring ${
                validationErrors.slug ? "border-red-500" : ""
              }`}
              required
            />
            {validationErrors.slug ? (
              <p className="mt-1 text-xs text-red-500">
                {validationErrors.slug}
              </p>
            ) : (
              <p className="mt-1 text-xs text-gray-400">
                Used in the URL: /projects/
                <span className="font-mono">
                  {formData.slug || "project-slug"}
                </span>
              </p>
            )}
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label
              htmlFor="categories"
              className="text-foreground block text-sm font-medium"
            >
              Categories <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div
                className={`border-navy-600 bg-navy-700/50 rounded-lg border shadow-sm ${
                  validationErrors.categories ? "border-red-500" : ""
                }`}
              >
                {formData.categories.length > 0 ? (
                  <div className="flex items-center justify-between p-3">
                    <CategoriesWithIcons categoryIds={formData.categories} maxDisplay={3} showBadge={false} />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, categories: [] })}
                      className="text-gray-400 hover:text-gray-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="p-3 text-gray-400">Select categories</div>
                )}
              </div>

              {/* Category options */}
              <div className="border-navy-600 bg-navy-700/90 mt-1 max-h-52 overflow-y-auto rounded-lg border shadow-lg">
                <div className="p-2">
                  {PROJECT_CATEGORIES.map((category) => (
                    <div
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`my-1 flex cursor-pointer items-center justify-between rounded-md p-2 ${
                        formData.categories.includes(category.id)
                          ? "bg-neon/20 text-neon"
                          : "hover:bg-navy-600/80"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {category.icon}
                        <span>{category.label}</span>
                      </div>
                      {formData.categories.includes(category.id) && (
                        <Check className="h-4 w-4" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {validationErrors.categories && (
              <p className="mt-1 text-xs text-red-500">
                {validationErrors.categories}
              </p>
            )}
          </div>

          {/* GitHub URL */}
          <div className="space-y-2">
            <label
              htmlFor="github_url"
              className="text-foreground block text-sm font-medium"
            >
              GitHub URL
            </label>
            <input
              type="url"
              id="github_url"
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
              className="body border-navy-600 bg-navy-700/50 text-foreground focus:border-neon focus:ring-neon/20 focus:ring-opacity-50 w-full rounded-lg border p-3 placeholder-gray-400 shadow-sm focus:ring"
            />
          </div>

          {/* Live URL */}
          <div className="space-y-2">
            <label
              htmlFor="live_url"
              className="text-foreground block text-sm font-medium"
            >
              Live Demo URL
            </label>
            <input
              type="url"
              id="live_url"
              name="live_url"
              value={formData.live_url}
              onChange={handleChange}
              className="body border-navy-600 bg-navy-700/50 text-foreground focus:border-neon focus:ring-neon/20 focus:ring-opacity-50 w-full rounded-lg border p-3 placeholder-gray-400 shadow-sm focus:ring"
            />
          </div>
        </div>

        {/* Short Description */}
        <div className="space-y-2">
          <label
            htmlFor="short_description"
            className="text-foreground block text-sm font-medium"
          >
            Short Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="short_description"
            name="short_description"
            value={formData.short_description}
            onChange={handleChange}
            rows={2}
            className={`body border-navy-600 bg-navy-700/50 text-foreground focus:border-neon focus:ring-neon/20 focus:ring-opacity-50 w-full rounded-lg border p-3 placeholder-gray-400 shadow-sm focus:ring ${
              validationErrors.short_description ? "border-red-500" : ""
            }`}
            required
          />
          {validationErrors.short_description ? (
            <p className="mt-1 text-xs text-red-500">
              {validationErrors.short_description}
            </p>
          ) : (
            <p className="mt-1 text-xs text-gray-400">
              A brief summary for the project card (1-2 sentences).
            </p>
          )}
        </div>

        {/* Project Dates */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Start Date */}
          <div className="space-y-2">
            <label
              htmlFor="start_date"
              className="text-foreground block text-sm font-medium"
            >
              Start Date
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="body border-navy-600 bg-navy-700/50 text-foreground focus:border-neon focus:ring-neon/20 focus:ring-opacity-50 w-full rounded-lg border p-3 placeholder-gray-400 shadow-sm focus:ring"
            />
            <p className="mt-1 text-xs text-gray-400">
              When did you start working on this project?
            </p>
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <label
              htmlFor="end_date"
              className="text-foreground block text-sm font-medium"
            >
              End Date
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="body border-navy-600 bg-navy-700/50 text-foreground focus:border-neon focus:ring-neon/20 focus:ring-opacity-50 w-full rounded-lg border p-3 placeholder-gray-400 shadow-sm focus:ring"
            />
            <p className="mt-1 text-xs text-gray-400">
              Leave blank if this is an ongoing project.
            </p>
          </div>
        </div>

        {/* Featured Project Toggle */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={!!formData.featured}
            onChange={(e) =>
              setFormData({ ...formData, featured: e.target.checked })
            }
            className="border-navy-600 bg-navy-700/50 text-neon focus:ring-neon/20 h-5 w-5 rounded border"
          />
          <label
            htmlFor="featured"
            className="text-foreground text-sm font-medium"
          >
            Feature this project on homepage
          </label>
        </div>

        {/* Long Description with Enhanced Markdown Editor */}
        <div className="space-y-2">
          <label
            htmlFor="long_description"
            className="text-foreground block text-sm font-medium"
          >
            Long Description <span className="text-red-500">*</span>
          </label>
          <div
            className={
              validationErrors.long_description
                ? "rounded-lg border border-red-500 p-0.5"
                : ""
            }
          >
            <EnhancedMarkdownEditor
              value={formData.long_description}
              onChange={handleMarkdownChange}
              placeholder="Write your project description using Markdown..."
              height="400px"
            />
          </div>
          {validationErrors.long_description ? (
            <p className="mt-1 text-xs text-red-500">
              {validationErrors.long_description}
            </p>
          ) : (
            <p className="mt-1 text-xs text-gray-400">
              Detailed description supports Markdown formatting.{" "}
              <strong>Drag and drop images</strong> directly into the editor,
              paste from clipboard, or click the image button to upload. Include
              sections like Overview, Features, Technical Details, Challenges &
              Solutions, etc.
            </p>
          )}
        </div>

        {/* Technologies */}
        <div className="space-y-2">
          <label
            htmlFor="technologies"
            className="text-foreground block text-sm font-medium"
          >
            Technologies <span className="text-red-500">*</span>
          </label>

          <div id="tech-dropdown-container" className="relative">
            {/* Selected technologies display */}
            <div
              className={`border-navy-600 bg-navy-700/50 flex flex-wrap gap-2 rounded-lg border p-3 ${
                validationErrors.technologies ? "border-red-500" : ""
              }`}
            >
              {formData.technologies.length > 0 ? (
                formData.technologies.map((techId: string) => (
                  <div
                    key={techId}
                    className="bg-navy-600/80 border-navy-500 inline-flex items-center rounded-full border px-3 py-1.5"
                  >
                    <TechnologyWithIcon techId={techId} />
                    <button
                      type="button"
                      onClick={() => handleToggleTech(techId)}
                      className="ml-2 text-gray-400 transition-colors hover:text-red-400"
                    >
                      ✕
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-gray-400">Select technologies</div>
              )}

              <button
                type="button"
                onClick={() => setTechDropdownOpen(!techDropdownOpen)}
                className="bg-navy-600 hover:bg-navy-500 inline-flex h-8 w-8 items-center justify-center rounded-full"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Dropdown menu for technologies */}
            {techDropdownOpen && (
              <div className="border-navy-600 bg-navy-700/90 absolute right-0 left-0 z-10 mt-1 max-h-52 overflow-y-auto rounded-lg border shadow-lg">
                <div className="p-2">
                  {TECHNOLOGIES.map((tech) => {
                    const isSelected = formData.technologies.includes(tech.id);
                    const TechIcon = tech.icon;

                    return (
                      <div
                        key={tech.id}
                        onClick={() => handleToggleTech(tech.id)}
                        className={`my-1 flex cursor-pointer items-center justify-between rounded-md p-2 ${
                          isSelected
                            ? "bg-neon/20 text-neon"
                            : "hover:bg-navy-600/80"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <TechIcon />
                          <span>{tech.name}</span>
                        </div>
                        {isSelected && <Check className="h-4 w-4" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {validationErrors.technologies && (
            <p className="mt-1 text-xs text-red-500">
              {validationErrors.technologies}
            </p>
          )}
        </div>

        {/* Featured Image */}
        <div className="space-y-2">
          <label
            htmlFor="featured_image"
            className="text-foreground block text-sm font-medium"
          >
            Featured Image <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-4">
            {/* Existing image from database */}
            {formData.featured_image && (
              <div className="border-navy-500 relative h-28 w-28 overflow-hidden rounded-lg border shadow-md">
                <Image
                  src={formData.featured_image}
                  alt="Featured image"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-0 right-0 rounded-bl-lg bg-green-500/80 p-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
            )}

            {/* New image selected but not uploaded yet */}
            {!formData.featured_image && imagePreviewUrl && (
              <div className="border-navy-500 relative h-28 w-28 overflow-hidden rounded-lg border shadow-md">
                <Image
                  src={imagePreviewUrl}
                  alt="Featured image preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-0 right-0 rounded-bl-lg bg-blue-500/80 p-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
            )}

            <div className="flex-1">
              <label
                className={`body-light group border-navy-500 bg-navy-700/30 hover:bg-navy-700/50 flex w-full cursor-pointer flex-col items-center rounded-lg border ${
                  validationErrors.featured_image
                    ? "border-red-500"
                    : "border-dashed"
                } p-5 text-center transition`}
              >
                <div className="flex flex-col items-center justify-center pt-2 pb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="mb-2 h-8 w-8 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                  <p className="mb-1 text-sm text-gray-400">
                    <span className="font-medium">Click to upload</span> or drag
                    and drop
                  </p>
                  <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF</p>
                </div>
                <input
                  type="file"
                  id="featured_image"
                  accept="image/*"
                  onChange={handleFeaturedImageChange}
                  className="hidden"
                  required={!formData.featured_image && !imagePreviewUrl}
                />
              </label>
            </div>
          </div>
          {validationErrors.featured_image ? (
            <p className="mt-1 text-xs text-red-500">
              {validationErrors.featured_image}
            </p>
          ) : (
            <p className="mt-1 text-xs text-gray-400">
              Main image shown in the project header and card.
              {formData.featured_image || imagePreviewUrl ? (
                <span className="ml-2 text-green-400">✓ Image selected</span>
              ) : null}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="border-navy-600 flex justify-end border-t pt-6">
          {isSubmitting && uploadProgress > 0 && (
            <div className="mr-4 flex items-center">
              <div className="bg-navy-600 relative h-2 w-40 overflow-hidden rounded-full">
                <div
                  className="bg-neon absolute top-0 left-0 h-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm text-gray-400">
                {uploadProgress}%
              </span>
            </div>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="group from-neon to-neon-4 text-navy-900 hover:from-neon-4 hover:to-neon relative overflow-hidden rounded-lg bg-gradient-to-r px-6 py-3 font-medium shadow-md transition-all hover:shadow-lg disabled:opacity-70 disabled:hover:shadow-none"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </span>
            ) : isEditing ? (
              "Update Project"
            ) : (
              "Create Project"
            )}
            <span className="absolute inset-0 -translate-y-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-y-full"></span>
          </Button>
        </div>
      </form>
    </div>
  );
}
