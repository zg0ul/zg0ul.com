"use client";

import { Check, AlertCircle } from "lucide-react";
import { PROJECT_CATEGORIES } from "@/components/ProjectCategories";

interface CategorySelectorProps {
  value: string[];
  error?: string;
  onChange: (categories: string[]) => void;
}

export default function CategorySelector({
  value,
  error,
  onChange,
}: CategorySelectorProps) {
  const handleToggleCategory = (categoryId: string) => {
    if (value.includes(categoryId)) {
      // Remove category
      onChange(value.filter((id) => id !== categoryId));
    } else {
      // Add category
      onChange([...value, categoryId]);
    }
  };

  return (
    <div className="bg-navy-800/50 border-navy-600 rounded-xl border p-6 shadow-lg backdrop-blur-sm">
      <h3 className="text-foreground mb-4 text-lg font-semibold">
        Categories <span className="text-red-500">*</span>
      </h3>
      <p className="text-navy-300 mb-4 text-sm">
        Select one or more categories for this project.
      </p>

      <div className="space-y-2">
        {PROJECT_CATEGORIES.map((category) => {
          const isSelected = value.includes(category.id);
          return (
            <label
              key={category.id}
              className={`flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors ${
                isSelected
                  ? "bg-neon/20 border-neon border"
                  : "bg-navy-700/30 border-navy-600 hover:bg-navy-700/50 border"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggleCategory(category.id)}
                  className="sr-only"
                />
                {category.icon}
                <span className="font-medium">{category.label}</span>
              </div>
              {isSelected && <Check className="text-neon h-4 w-4" />}
            </label>
          );
        })}
      </div>

      {error && (
        <p className="mt-2 flex items-center text-sm text-red-400">
          <AlertCircle className="mr-1 h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
}
