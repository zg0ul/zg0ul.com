// TODO: Add tags to generate metadata
export type ProjectType = {
  id?: string;
  title: string;
  slug: string;
  short_description: string;
  long_description: string;
  featured_image: string;
  github_url: string;
  live_url: string;
  categories: string[];
  technologies: string[];
  gallery_images: string[];
  created_at?: string;
  updated_at?: string;
  start_date?: string;
  end_date?: string;
  featured?: boolean;
  display_order?: number;
};
