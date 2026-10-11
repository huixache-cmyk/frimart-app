import React from "react";
import { 
  Sparkles, 
  Salad, 
  Apple, 
  Beef, 
  Fish, 
  UtensilsCrossed, 
  IceCream,
  Flame,
  Tag
} from "lucide-react";

export default function CategoryChips({ 
  categories, 
  selectedCategoryId, 
  onSelectCategory,
  variant = "icons-vertical" // 'icons-vertical' (Airbnb image 1) | 'pills' (Airbnb image 2)
}) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case "Salad":
        return Salad;
      case "Apple":
        return Apple;
      case "Beef":
        return Beef;
      case "Fish":
        return Fish;
      case "UtensilsCrossed":
        return UtensilsCrossed;
      case "IceCream":
        return IceCream;
      default:
        return Sparkles;
    }
  };

  // Airbnb Image 1 Style: Visual icon above + Label below
  if (variant === "icons-vertical") {
    return (
      <div className="w-full overflow-x-auto no-scrollbar py-2 -mx-4 px-4 flex items-center gap-4">
        {categories.map((cat) => {
          const IconComponent = getIcon(cat.icon);
          const isSelected = selectedCategoryId === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="tap-effect shrink-0 flex flex-col items-center justify-center min-w-[62px] text-center cursor-pointer group"
            >
              {/* Icon Container with subtle background */}
              <div 
                className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                  isSelected
                    ? "bg-[#059669] text-white shadow-sm scale-105"
                    : "bg-[#f8fafc] text-slate-700 border border-[#e2e8f0] group-hover:border-slate-300 group-hover:bg-slate-100"
                }`}
              >
                <IconComponent 
                  className={`w-6 h-6 stroke-[2] ${
                    isSelected ? "text-white" : "text-[#059669]"
                  }`} 
                />
              </div>

              {/* Label below */}
              <span 
                className={`text-[11px] mt-1.5 whitespace-nowrap transition-colors ${
                  isSelected 
                    ? "font-bold text-[#059669]" 
                    : "font-medium text-slate-700 group-hover:text-slate-900"
                }`}
              >
                {cat.shortName}
              </span>

              {/* Active Indicator Line like Airbnb */}
              <div 
                className={`h-0.5 rounded-full mt-1 transition-all ${
                  isSelected ? "w-6 bg-[#059669]" : "w-0 bg-transparent"
                }`} 
              />
            </button>
          );
        })}
      </div>
    );
  }

  // Airbnb Image 2 Style: Rounded pill chips with icon on left
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 -mx-4 px-4 flex items-center gap-2">
      {categories.map((cat) => {
        const IconComponent = getIcon(cat.icon);
        const isSelected = selectedCategoryId === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`tap-effect shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              isSelected
                ? "bg-[#059669] text-white border-[#059669] shadow-2xs"
                : "bg-white text-slate-700 border-[#e2e8f0] hover:border-slate-300 hover:bg-[#f8fafc]"
            }`}
          >
            <IconComponent 
              className={`w-3.5 h-3.5 ${
                isSelected ? "text-white" : "text-[#059669]"
              }`} 
            />
            <span className="whitespace-nowrap">{cat.shortName}</span>
          </button>
        );
      })}
    </div>
  );
}
