import React from "react";
import { Template } from "../../types";
import { Star, Sparkles, Eye, ArrowRight, Music, Heart } from "lucide-react";
import { motion } from "motion/react";
interface TemplateCardProps {
  template: Template;
  onViewDemo: (template: Template) => void;
  onUseTemplate: (template: Template) => void;
}
export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onViewDemo,
  onUseTemplate,
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group bg-white/60 rounded-2xl overflow-hidden border border-[#b0ba99] shadow-sm hover:shadow-xl hover:shadow-purple-100/60 :shadow-purple-950/20 hover:border-[#b0ba99] :border-[#b0ba99] transition-all flex flex-col h-full"
    >
      {" "}
      {/* Top Image Frame */}{" "}
      <div className="relative aspect-[16/10] overflow-hidden bg-white/60/60 ">
        {" "}
        <img
          src={template.previewImage}
          alt={template.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />{" "}
        {/* Subtle Dark Gradient Overlay at bottom for legibility */}{" "}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />{" "}
        {/* Top Badges */}{" "}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {" "}
          {/* Category Pill */}{" "}
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/60/90 backdrop-blur-md text-[#4e220f] shadow-sm border border-white/40">
            {" "}
            {template.categoryName}{" "}
          </span>{" "}
          {/* Free / Premium Badge */}{" "}
          {template.isPremium ? (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#b0ba99] text-white shadow-sm flex items-center gap-1">
              {" "}
              <Sparkles className="w-3 h-3 text-[#9d6638]" /> Pro{" "}
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-sm">
              {" "}
              Free{" "}
            </span>
          )}{" "}
        </div>{" "}
        {/* Quick Stats Overlay */}{" "}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-semibold">
          {" "}
          <div className="flex items-center gap-1 bg-black/45 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
            {" "}
            <Star className="w-3.5 h-3.5 text-[#9d6638] fill-amber-400" />{" "}
            <span>{template.rating}</span>{" "}
          </div>{" "}
          <div className="flex items-center gap-1 bg-black/45 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
            {" "}
            <Heart className="w-3.5 h-3.5 text-[#9d6638] fill-pink-400" />{" "}
            <span>{template.useCount.toLocaleString()} created</span>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Card Body */}{" "}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        {" "}
        <div className="space-y-1.5">
          {" "}
          <h3 className="text-base sm:text-lg font-bold text-[#4e220f] tracking-tight group-hover:text-[#9d6638] :text-[#9d6638] transition-colors line-clamp-1">
            {" "}
            {template.title}{" "}
          </h3>{" "}
          <p className="text-xs text-[#4e220f] leading-relaxed line-clamp-2">
            {" "}
            {template.description}{" "}
          </p>{" "}
        </div>{" "}
        {/* Feature Tags */}{" "}
        <div className="flex flex-wrap gap-1.5">
          {" "}
          {template.features.slice(0, 3).map((feat, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#b0ba99] text-[#9d6638] border border-[#b0ba99] "
            >
              {" "}
              {feat}{" "}
            </span>
          ))}{" "}
        </div>{" "}
        {/* Card Buttons */}{" "}
        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#b0ba99] ">
          {" "}
          <button
            onClick={() => onViewDemo(template)}
            className="w-full py-2.5 px-3 rounded-xl border border-[#b0ba99] hover:bg-white/60/60 :bg-white/60/60 text-[#4e220f] font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
          >
            {" "}
            <Eye className="w-3.5 h-3.5 text-[#4e220f]" />{" "}
            <span>Preview</span>{" "}
          </button>{" "}
          <button
            onClick={() => onUseTemplate(template)}
            className="w-full py-2.5 px-3 rounded-xl bg-[#9d6638] hover:bg-[#6D28D9] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {" "}
            <span>Use This</span> <ArrowRight className="w-3.5 h-3.5" />{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </motion.div>
  );
};
