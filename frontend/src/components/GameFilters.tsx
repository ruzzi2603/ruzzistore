'use client';

import { useState, useCallback } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';

interface FilterOptions {
  searchTerm: string;
  genre: string;
  priceRange: 'all' | 'free' | 'bajo' | 'medio' | 'alto';
  platform: string;
  sortBy: 'relevance' | 'newest' | 'priceAsc' | 'priceDesc' | 'rating';
}

interface GameFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  isOpen?: boolean;
}

const genres = [
  'Todos',
  'Ação',
  'Aventura',
  'RPG',
  'Estratégia',
  'Simulação',
  'Esporte',
  'Puzzle',
  'Shooter',
];

const platforms = [
  'Todos',
  'PC',
  'Steam',
  'Epic Games',
  'GOG',
  'Amazon Prime Gaming',
];

const priceRanges = [
  { key: 'all', label: 'Todos os preços' },
  { key: 'free', label: 'Grátis' },
  { key: 'bajo', label: 'Até R$ 50' },
  { key: 'medio', label: 'R$ 50 - R$ 150' },
  { key: 'alto', label: 'Acima de R$ 150' },
];

const sortOptions = [
  { key: 'relevance', label: 'Relevância' },
  { key: 'newest', label: 'Mais recentes' },
  { key: 'priceAsc', label: 'Menor preço' },
  { key: 'priceDesc', label: 'Maior preço' },
  { key: 'rating', label: 'Melhor avaliação' },
];

export default function GameFilters({ onFiltersChange, isOpen = false }: GameFiltersProps) {
  const [showFilters, setShowFilters] = useState(isOpen);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    genre: 'Todos',
    priceRange: 'all',
    platform: 'Todos',
    sortBy: 'relevance',
  });

  const handleFilterChange = useCallback(
    (newFilters: Partial<FilterOptions>) => {
      const updated = { ...filters, ...newFilters };
      setFilters(updated);
      onFiltersChange(updated);
    },
    [filters, onFiltersChange]
  );

  const handleReset = () => {
    const defaultFilters: FilterOptions = {
      searchTerm: '',
      genre: 'Todos',
      priceRange: 'all',
      platform: 'Todos',
      sortBy: 'relevance',
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const isFiltered =
    filters.genre !== 'Todos' ||
    filters.priceRange !== 'all' ||
    filters.platform !== 'Todos' ||
    filters.sortBy !== 'relevance' ||
    filters.searchTerm !== '';

  return (
    <div className="w-full space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search
          size={20}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          type="text"
          placeholder="Buscar jogos por nome..."
          value={filters.searchTerm}
          onChange={(e) => handleFilterChange({ searchTerm: e.target.value })}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          aria-label="Buscar jogos"
        />
      </div>

      {/* Filter Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200 transition-colors"
        aria-expanded={showFilters ? 'true' : 'false'}
        aria-controls="filters-panel"
      >
        <ChevronDown
          size={16}
          className={`transition-transform ${showFilters ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
        {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
        {isFiltered && <span className="text-xs bg-cyan-400/20 px-2 py-1 rounded">Ativo</span>}
      </button>

      {/* Filters Panel */}
      {showFilters && (
        <div
          id="filters-panel"
          className="space-y-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700"
          role="region"
          aria-label="Painel de filtros"
        >
          {/* Genre Filter */}
          <div>
            <label htmlFor="genre-select" className="block text-sm font-semibold mb-2 text-slate-200">
              Gênero
            </label>
            <select
              id="genre-select"
              value={filters.genre}
              onChange={(e) => handleFilterChange({ genre: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-cyan-400"
            >
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* Platform Filter */}
          <div>
            <label htmlFor="platform-select" className="block text-sm font-semibold mb-2 text-slate-200">
              Plataforma
            </label>
            <select
              id="platform-select"
              value={filters.platform}
              onChange={(e) => handleFilterChange({ platform: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-cyan-400"
            >
              {platforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div>
            <label htmlFor="price-select" className="block text-sm font-semibold mb-2 text-slate-200">
              Faixa de Preço
            </label>
            <select
              id="price-select"
              value={filters.priceRange}
              onChange={(e) => handleFilterChange({ priceRange: e.target.value as typeof filters.priceRange })}
              className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-cyan-400"
            >
              {priceRanges.map((range) => (
                <option key={range.key} value={range.key}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label htmlFor="sort-select" className="block text-sm font-semibold mb-2 text-slate-200">
              Ordenar por
            </label>
            <select
              id="sort-select"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value as typeof filters.sortBy })}
              className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-cyan-400"
            >
              {sortOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          {isFiltered && (
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-sm font-semibold text-slate-300"
              aria-label="Limpar todos os filtros"
            >
              <X size={16} aria-hidden="true" />
              Limpar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}