import React from "react";
import { ArrowRight, ChevronRight } from "lucide-react";

export default function SectionHeader({ 
  title, 
  subtitle, 
  onViewAll, 
  viewAllText = "Ver todos",
  variant = "arrow-circle" // 'arrow-circle' (Airbnb style) | 'text-chevron'
}) {
  return (
    <div className="flex items-center justify-between mb-3 pt-2">
      <div className="pr-2">
        <h2 className="font-section-title text-[#0f172a] tracking-tight leading-normal">
          {title}
        </h2>
        {subtitle && (
          <p className="font-secondary text-slate-500 mt-1 text-xs leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {onViewAll && (
        variant === "arrow-circle" ? (
          <button
            onClick={onViewAll}
            className="tap-effect w-8 h-8 rounded-full bg-[#f1f5f9] hover:bg-slate-200 active:bg-slate-300 flex items-center justify-center text-slate-800 transition cursor-pointer shrink-0 shadow-2xs"
            aria-label={`Ver más de ${title}`}
            title="Ver más"
          >
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </button>
        ) : (
          <button
            onClick={onViewAll}
            className="tap-effect flex items-center gap-0.5 text-xs font-semibold text-[#059669] hover:text-[#047857] pb-0.5 cursor-pointer shrink-0"
          >
            <span>{viewAllText}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )
      )}
    </div>
  );
}
