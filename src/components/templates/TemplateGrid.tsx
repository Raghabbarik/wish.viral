import React, { useState, useMemo, useRef } from "react";
import { Template, CategoryId } from "../../types";
import { TemplateCard } from "./TemplateCard";
import { CATEGORIES } from "../../data/mockData";
import {
  Search,
  Sparkles,
  Filter,
  Check,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  SlidersHorizontal,
} from "lucide-react";
interface TemplateGridProps {
  templates: Template[];
  onViewDemo: (template: Template) => void;
  onUseTemplate: (template: Template) => void;
  selectedCategory?: CategoryId | "all";
  onCategoryChange?: (category: CategoryId | "all") => void;
  showFilters?: boolean;
  defaultLayout?: "grid" | "carousel";
}
export const TemplateGrid: React.FC<TemplateGridProps> = ({
  templates,
  onViewDemo,
  onUseTemplate,
  selectedCategory = "all",
  onCategoryChange,
  showFilters = true,
  defaultLayout = "grid",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [catFilter, setCatFilter] = useState<CategoryId | "all">(
    selectedCategory,
  );
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "premium">(
    "all",
  );
  const [layoutMode, setLayoutMode] = useState<"grid" | "carousel">(
    defaultLayout,
  );
  const carouselRef = useRef<HTMLDivElement>(null);
  const handleCategorySelect = (cat: CategoryId | "all") => {
    setCatFilter(cat);
    if (onCategoryChange) onCategoryChange(cat);
  };
  const handleScrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -340, behavior: "smooth" });
    }
  };
  const handleScrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 340, behavior: "smooth" });
    }
  };
  const filteredTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      const matchesSearch =
        tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = catFilter === "all" || tpl.category === catFilter;
      const matchesPrice =
        priceFilter === "all" ||
        (priceFilter === "free" && !tpl.isPremium) ||
        (priceFilter === "premium" && tpl.isPremium);
      return matchesSearch && matchesCat && matchesPrice;
    });
  }, [templates, searchQuery, catFilter, priceFilter]);
  return (
    <div className="space-y-6">
      {" "}
      {/* Search, Filter & Layout Controls */}{" "}
      <div className="space-y-4">
        {" "}
        {showFilters && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {" "}
            {/* Search Input */}{" "}
            <div className="relative w-full sm:max-w-md">
              {" "}
              <Search className="w-5 h-5 text-[#4e220f] absolute left-4 top-3.5" />{" "}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates (e.g. Birthday, Romantic, Graduation)..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-[#b0ba99] bg-white/60 text-[#4e220f] text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-[#7C3AED] shadow-sm"
              />{" "}
            </div>{" "}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {" "}
              {/* Price Filter Pill Segment */}{" "}
              <div className="flex items-center gap-1 p-1 bg-white/60/60 rounded-2xl text-xs font-bold">
                {" "}
                <button
                  onClick={() => setPriceFilter("all")}
                  className={`px-3 py-1.5 rounded-xl transition-all ${priceFilter === "all" ? "bg-white/60 text-[#4e220f] shadow-sm" : "text-[#4e220f] hover:text-[#4e220f] :text-[#4e220f]"}`}
                >
                  {" "}
                  All{" "}
                </button>{" "}
                <button
                  onClick={() => setPriceFilter("free")}
                  className={`px-3 py-1.5 rounded-xl transition-all ${priceFilter === "free" ? "bg-emerald-500 text-white shadow-sm" : "text-[#4e220f] hover:text-[#4e220f] :text-[#4e220f]"}`}
                >
                  {" "}
                  Free{" "}
                </button>{" "}
                <button
                  onClick={() => setPriceFilter("premium")}
                  className={`px-3 py-1.5 rounded-xl transition-all ${priceFilter === "premium" ? "bg-[#9d6638] text-white shadow-sm" : "text-[#4e220f] hover:text-[#4e220f] :text-[#4e220f]"}`}
                >
                  {" "}
                  Pro{" "}
                </button>{" "}
              </div>{" "}
              {/* Layout Switcher (Grid vs Horizontal Slider) */}{" "}
              <div className="flex items-center gap-1 p-1 bg-white/60/60 rounded-2xl text-xs font-bold">
                {" "}
                <button
                  onClick={() => setLayoutMode("grid")}
                  title="Grid View"
                  className={`p-2 rounded-xl transition-all ${layoutMode === "grid" ? "bg-white/60 text-[#9d6638] shadow-sm" : "text-[#4e220f] hover:text-[#4e220f] :text-[#4e220f]"}`}
                >
                  {" "}
                  <LayoutGrid className="w-4 h-4" />{" "}
                </button>{" "}
                <button
                  onClick={() => setLayoutMode("carousel")}
                  title="Horizontal Scroll View (Left to Right)"
                  className={`p-2 rounded-xl transition-all ${layoutMode === "carousel" ? "bg-white/60 text-[#9d6638] shadow-sm" : "text-[#4e220f] hover:text-[#4e220f] :text-[#4e220f]"}`}
                >
                  {" "}
                  <SlidersHorizontal className="w-4 h-4" />{" "}
                </button>{" "}
              </div>{" "}
            </div>{" "}
          </div>
        )}{" "}
        {/* Category Filter Pills */}{" "}
        {showFilters && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {" "}
            <button
              onClick={() => handleCategorySelect("all")}
              className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${catFilter === "all" ? "bg-[#1A1A1A] text-white border-transparent shadow-md" : "bg-white/60 text-[#4e220f] border-[#b0ba99] hover:border-[#b0ba99]"}`}
            >
              {" "}
              <span>✨ All Categories</span>{" "}
            </button>{" "}
            {CATEGORIES.map((cat) => {
              const isSelected = catFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${isSelected ? "bg-[#9d6638] text-white border-transparent shadow-md shadow-purple-200" : "bg-white/60 text-[#4e220f] border-[#b0ba99] hover:border-[#b0ba99]"}`}
                >
                  {" "}
                  <span>{cat.emoji}</span> <span>{cat.name}</span>{" "}
                </button>
              );
            })}{" "}
          </div>
        )}{" "}
      </div>{" "}
      {/* Templates Display */}{" "}
      {filteredTemplates.length > 0 ? (
        layoutMode === "carousel" ? (
          /* LEFT-TO-RIGHT HORIZONTAL SLIDER / CAROUSEL */ <div className="relative group/carousel">
            {" "}
            {/* Scroll Left Button */}{" "}
            <button
              onClick={handleScrollLeft}
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/60 text-[#4e220f] border border-[#b0ba99] shadow-xl flex items-center justify-center hover:bg-[#b0ba99] :bg-white/60/60 hover:scale-110 active:scale-95 transition-all opacity-90 sm:opacity-0 group-hover/carousel:opacity-100"
              aria-label="Scroll templates left"
            >
              {" "}
              <ChevronLeft className="w-5 h-5 text-[#9d6638]" />{" "}
            </button>{" "}
            {/* Scroll Right Button */}{" "}
            <button
              onClick={handleScrollRight}
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/60 text-[#4e220f] border border-[#b0ba99] shadow-xl flex items-center justify-center hover:bg-[#b0ba99] :bg-white/60/60 hover:scale-110 active:scale-95 transition-all opacity-90 sm:opacity-0 group-hover/carousel:opacity-100"
              aria-label="Scroll templates right"
            >
              {" "}
              <ChevronRight className="w-5 h-5 text-[#9d6638]" />{" "}
            </button>{" "}
            {/* Horizontal Scroll Track */}{" "}
            <div
              ref={carouselRef}
              className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory py-3 px-1 scrollbar-none"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {" "}
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="shrink-0 w-[290px] sm:w-[330px] snap-start"
                >
                  {" "}
                  <TemplateCard
                    template={template}
                    onViewDemo={onViewDemo}
                    onUseTemplate={onUseTemplate}
                  />{" "}
                </div>
              ))}{" "}
            </div>{" "}
            {/* Left to Right Helper Badge */}{" "}
            <div className="flex items-center justify-between text-xs text-[#4e220f] pt-1 px-2">
              {" "}
              <span className="flex items-center gap-1 font-semibold text-[#9d6638]">
                {" "}
                <SlidersHorizontal className="w-3.5 h-3.5" />{" "}
                <span>
                  Swipe / Scroll Left to Right to explore templates
                </span>{" "}
              </span>{" "}
              <span>{filteredTemplates.length} templates available</span>{" "}
            </div>{" "}
          </div>
        ) : (
          /* STANDARD GRID LAYOUT */ <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {" "}
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onViewDemo={onViewDemo}
                onUseTemplate={onUseTemplate}
              />
            ))}{" "}
          </div>
        )
      ) : (
        <div className="text-center py-16 px-4 bg-white/60/60 rounded-3xl border border-dashed border-[#b0ba99] space-y-3">
          {" "}
          <p className="text-3xl">🔍</p>{" "}
          <h3 className="text-lg font-bold text-[#4e220f] ">
            No celebration templates found
          </h3>{" "}
          <p className="text-sm text-[#4e220f] max-w-sm mx-auto">
            {" "}
            Try adjusting your search terms or clearing category filters to find
            the perfect celebration page.{" "}
          </p>{" "}
          <button
            onClick={() => {
              setSearchQuery("");
              setCatFilter("all");
              setPriceFilter("all");
            }}
            className="mt-2 px-4 py-2 bg-[#9d6638] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
          >
            {" "}
            Reset Filters{" "}
          </button>{" "}
        </div>
      )}{" "}
    </div>
  );
};
