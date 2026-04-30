import type { PostCategory } from "@/lib/database.types";
import { cn } from "@/lib/utils";

interface BlogCategoryFilterProps {
  categories: PostCategory[];
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
}

export default function BlogCategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: BlogCategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-10">
      <button
        onClick={() => onCategoryChange("all")}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-colors",
          activeCategory === "all"
            ? "bg-black text-white"
            : "bg-white text-gray-600 hover:bg-gray-100 border border-brand-border"
        )}
      >
        All Posts
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.slug)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            activeCategory === cat.slug
              ? "bg-black text-white"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-brand-border"
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
