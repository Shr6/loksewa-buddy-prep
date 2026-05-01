import globeIcon from "@/assets/icons/globe.png";
import calcIcon from "@/assets/icons/calc.png";
import bookIcon from "@/assets/icons/book.png";
import brainIcon from "@/assets/icons/brain.png";
import type { CategoryKey } from "@/data/questions";

export const CATEGORY_ICONS: Record<CategoryKey, string> = {
  general_knowledge: globeIcon,
  math: calcIcon,
  english: bookIcon,
  logic: brainIcon,
};

export const CATEGORY_GRADIENT: Record<CategoryKey, string> = {
  general_knowledge: "from-emerald-400/20 to-teal-400/20",
  math: "from-amber-400/20 to-orange-400/20",
  english: "from-sky-400/20 to-blue-400/20",
  logic: "from-pink-400/20 to-rose-400/20",
};
