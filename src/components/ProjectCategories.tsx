import React from "react";
import {
  Code,
  Database,
  Cpu,
  Layers,
  Globe,
  Gamepad2,
  Brain,
} from "lucide-react";
import { FaMobileScreenButton } from "react-icons/fa6";
import { MdEngineering } from "react-icons/md";

// Define the project categories with their respective icons
export type ProjectCategory = {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  techs?: string[]; // Optional array of technologies within this category
};

// Export all available project categories
export const PROJECT_CATEGORIES: ProjectCategory[] = [
  {
    id: "frontend",
    label: "Frontend",
    icon: <Globe className="h-5 w-5 text-violet-400" />,
    description: "Web frontend applications and interfaces",
    techs: ["React", "Next.js", "Vue", "Angular", "HTML/CSS"],
  },
  {
    id: "mobile",
    label: "Mobile",
    icon: <FaMobileScreenButton className="h-5 w-5 text-sky-400" />,
    description: "Mobile applications for iOS and Android",
    techs: ["Flutter", "React Native", "Swift", "Kotlin"],
  },
  {
    id: "backend",
    label: "Backend",
    icon: <Database className="h-5 w-5 text-emerald-400" />,
    description: "Server-side applications and APIs",
    techs: ["Node.js", "Django", "Flask", "Spring", "Express"],
  },
  {
    id: "fullstack",
    label: "Full Stack",
    icon: <Layers className="h-5 w-5 text-rose-400" />,
    description: "End-to-end applications with frontend and backend",
    techs: ["MERN", "MEAN", "Django+React", "Flask+Vue"],
  },
  {
    id: "ai",
    label: "AI",
    icon: <Brain className="h-5 w-5 text-amber-400" />,
    description: "Artificial intelligence and machine learning projects",
    techs: ["TensorFlow", "PyTorch", "scikit-learn", "Keras"],
  },
  {
    id: "devops",
    label: "DevOps",
    icon: <Cpu className="h-5 w-5 text-indigo-400" />,
    description: "Infrastructure, CI/CD, and deployment projects",
    techs: ["Docker", "Kubernetes", "Jenkins", "GitHub Actions", "AWS"],
  },
  {
    id: "game",
    label: "Game Dev",
    icon: <Gamepad2 className="h-5 w-5 text-purple-400" />,
    description: "Game development projects",
    techs: ["Unity", "Unreal Engine", "Godot", "Phaser"],
  },
  {
    id: "engineering",
    label: "Engineering",
    icon: <MdEngineering className="h-5 w-5 text-orange-400" />,
    description: "Internet of Things projects and applications",
    techs: ["Arduino", "Raspberry Pi", "ESP8266", "MQTT"],
  },
  {
    id: "utilities",
    label: "Utilities",
    icon: <Code className="h-5 w-5 text-gray-400" />,
    description: "Tools, scripts, and utility applications",
    techs: ["Python", "Bash", "Go", "Rust"],
  },
];

// Function to get a category by its ID
export function getCategoryById(id: string): ProjectCategory | undefined {
  return PROJECT_CATEGORIES.find((category) => category.id === id);
}

// Function to get category with icon for display
export function CategoryWithIcon({ categoryId }: { categoryId: string }) {
  const category = getCategoryById(categoryId);

  if (!category) {
    return <span className="text-sm text-gray-400">Uncategorized</span>;
  }

  return (
    <div className="flex items-center gap-2">
      {category.icon}
      <span className="text-sm">{category.label}</span>
    </div>
  );
}

// Component to display multiple categories with icons
export function CategoriesWithIcons({
  categoryIds,
  maxDisplay = 2,
  showBadge = true,
}: {
  categoryIds: string[];
  maxDisplay?: number;
  showBadge?: boolean;
}) {
  if (!categoryIds || categoryIds.length === 0) {
    return <span className="text-sm text-gray-400">Uncategorized</span>;
  }

  const displayCategories = categoryIds.slice(0, maxDisplay);
  const remainingCount = categoryIds.length - maxDisplay;

  return (
    <div className="flex flex-wrap items-center gap-5">
      {displayCategories.map((categoryId) => {
        const category = getCategoryById(categoryId);
        if (!category) return null;
        return (
          <div key={categoryId} className="flex items-center gap-1.5">
            {category.icon}
            <span className="text-sm">{category.label}</span>
          </div>
        );
      })}
      {showBadge && remainingCount > 0 && (
        <span className="bg-navy-600/50 rounded-full px-2 py-0.5 text-xs text-gray-300">
          +{remainingCount}
        </span>
      )}
    </div>
  );
}

// Get all technologies across all categories
export function getAllTechnologies(): string[] {
  const allTechs: string[] = [];

  PROJECT_CATEGORIES.forEach((category) => {
    if (category.techs) {
      category.techs.forEach((tech) => {
        if (!allTechs.includes(tech)) {
          allTechs.push(tech);
        }
      });
    }
  });

  return allTechs.sort();
}

// Function to find categories that include a specific technology
export function getCategoriesByTechnology(tech: string): ProjectCategory[] {
  return PROJECT_CATEGORIES.filter((category) =>
    category.techs?.includes(tech),
  );
}
