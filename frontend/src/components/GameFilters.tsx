"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useRef, useState } from "react";

interface FilterOptions {
  searchTerm: string;
  genre: string;
  priceRange: "all" | "free" | "bajo" | "medio" | "alto";
  platform: string;
  sortBy: "relevance" | "newest" | "priceAsc" | "priceDesc" | "rating";
}

interface GameFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
}

type CategoryItem = {
  value: string;
  label: string;
  image: string;
};

const categoryItems: CategoryItem[] = [
  { value: "", label: "Todos", image: "/img/img9.webp" },
  { value: "action", label: "Ação", image: "/img/img.webp" },
  { value: "adventure", label: "Aventura", image: "/img/img2.webp" },
  { value: "role-playing", label: "RPG", image: "/img/img3.webp" },
  { value: "strategy", label: "Estratégia", image: "/img/img4.webp" },
  { value: "simulation", label: "Simulação", image: "/img/img5.webp" },
  { value: "sports", label: "Esportes", image: "/img/img6.webp" },
  { value: "puzzle", label: "Quebra-cabeça", image: "/img/img7.avif" },
  { value: "shooter", label: "Shooter", image: "/img/img8.webp" },
];

const defaultFilters: FilterOptions = {
  searchTerm: "",
  genre: "",
  priceRange: "all",
  platform: "Todos",
  sortBy: "relevance",
};

export default function GameFilters({ onFiltersChange }: GameFiltersProps) {
  const [selectedGenre, setSelectedGenre] = useState<string>(defaultFilters.genre);
  const trackRef = useRef<HTMLDivElement>(null);

  const canScroll = useMemo(() => categoryItems.length > 4, []);

  const applyCategory = (genre: string) => {
    setSelectedGenre(genre);
    onFiltersChange({ ...defaultFilters, genre });
  };

  const scrollTrack = (direction: "left" | "right") => {
    const node = trackRef.current;
    if (!node) return;
    const amount = Math.max(node.clientWidth * 0.8, 260);
    node.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative" aria-label="Explorar por categoria">
      <div className="mb-4">
        <h3 className="text-xs sm:text-sm tracking-widest uppercase text-slate-300 font-semibold">
          Explore por categoria
        </h3>
      </div>

      <div className="relative">
        <div
          ref={trackRef}
          className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
          role="group"
          aria-label="Lista de categorias"
        >
          {categoryItems.map((item) => {
            const active = selectedGenre === item.value;
            return (
              <button
                key={item.value || "all"}
                type="button"
                aria-pressed={active}
                onClick={() => applyCategory(item.value)}
                className={`group relative h-44 min-w-60 sm:min-w-64 overflow-hidden rounded-2xl border snap-start text-left transition-all ${
                  active
                    ? "border-cyan-300 ring-2 ring-cyan-300/50"
                    : "border-white/10 hover:border-cyan-300/40"
                }`}
              >
                <Image
                  src={item.image}
                  alt={`Categoria ${item.label}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 85vw, 260px"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex items-end justify-start p-4">
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-wide uppercase text-white drop-shadow-lg">
                    {item.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {canScroll && (
          <>
            <button
              type="button"
              onClick={() => scrollTrack("left")}
              className="absolute left-0 top-1/2 z-20 -translate-y-1/2 h-16 w-12 sm:h-20 sm:w-14 bg-slate-950/75 border border-white/10 rounded-r-xl text-white hover:bg-slate-900 transition-colors flex items-center justify-center"
              aria-label="Categorias anteriores"
            >
              <ChevronLeft size={26} />
            </button>

            <button
              type="button"
              onClick={() => scrollTrack("right")}
              className="absolute right-0 top-1/2 z-20 -translate-y-1/2 h-16 w-12 sm:h-20 sm:w-14 bg-slate-950/75 border border-white/10 rounded-l-xl text-white hover:bg-slate-900 transition-colors flex items-center justify-center"
              aria-label="Pr\u00f3ximas categorias"
            >
              <ChevronRight size={26} />
            </button>

            <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-linear-to-r from-slate-950/70 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-slate-950/70 to-transparent" />
          </>
        )}
      </div>
    </section>
  );
}
