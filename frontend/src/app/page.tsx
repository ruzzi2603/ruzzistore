'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState, useCallback } from 'react';
import GamesGrid from '@/components/Game/GamesGrid';
import CookieBanner from '@/components/CookieBanner';
import GameFilters from '@/components/GameFilters';
import { useAuth } from '@/components/context/AuthContext';

interface Game {
  id: number | string;
  title: string;
  imageUrl?: string;
  platform?: string;
  url?: string;
  isFree?: boolean;
  rating?: number | null;
  genres?: string[];
}

export default function Home() {
  const { user } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    searchTerm: '',
    genre: '',
    priceRange: 'all',
    platform: 'Todos',
    sortBy: 'relevance',
  });
  const PAGE_SIZE = 20;

  const fetchGames = useCallback(async (pageToLoad: number, isInitial = false) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/games?source=rawg&page=${pageToLoad}`,
        { cache: "no-store" },
      );
      if (!res.ok) {
        if (isInitial) setGames([]);
        return;
      }
      const data = await res.json();
      const safeData = Array.isArray(data)
        ? data
        : Array.isArray((data as any)?.results)
        ? (data as any).results
        : [];
      setAllGames(safeData as Game[]);
      const visibleCount = Math.min(safeData.length, pageToLoad * PAGE_SIZE);
      setGames((safeData as Game[]).slice(0, visibleCount));
      setPage(pageToLoad);
    } catch (err) {
      console.error('fetchGames error', err);
      if (isInitial) setGames([]);
    } finally {
      if (isInitial) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }, [PAGE_SIZE]);


  // load initial list
  useEffect(() => {
    fetchGames(1, true);
  }, [fetchGames]);

  const handleLoadMore = () => {
    fetchGames(page + 1);
  };
  const handleLoadLess = () => {
    if (page <= 1) return;
    const nextPage = page - 1;
    setPage(nextPage);
    setGames(allGames.slice(0, nextPage * PAGE_SIZE));
  };

  // apply filters whenever allGames, filters or page change
  useEffect(() => {
    let filtered = allGames;

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter((g) =>
        g.title.toLowerCase().includes(term)
      );
    }

    if (filters.genre) {
      const genreVal = filters.genre.toLowerCase();
      filtered = filtered.filter((g) =>
        Array.isArray(g.genres) &&
        g.genres.some((gn) => gn.toLowerCase().includes(genreVal))
      );
    }

    // platform/price sorting currently not supported by RAWG results

    const visibleCount = Math.min(filtered.length, page * PAGE_SIZE);
    setGames(filtered.slice(0, visibleCount));
  }, [allGames, filters, page]);

  const scrollToHighlights = () => {
    const el = document.getElementById("highlights-section");
    if (!el) return;
    const start = window.scrollY;
    const target = el.getBoundingClientRect().top + window.scrollY - 80;
    const duration = 900;
    const startTime = performance.now();

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);
      window.scrollTo(0, start + (target - start) * eased);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  return (
    <div className="min-h-screen text-white">
      <main className="w-full px-6 py-10">
       <div className='filt'>
        <section className="mb-12" id="princ">
          <div className="rounded-3xl " id="dvtn">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Distribuidora
            </p>

            <h1 className="text-4xl md:text-5xl font-semibold mt-3 text-white inline-flex items-center gap-3">
              <span>Plataforma de Jogos Digitais - ARENAGAMES</span>
            </h1>

            <p className="text-slate-400 mt-4 max-w-2xl">
              Explore títulos famosos e muitos outros, adicicione favoritos e
              descubra novos jogos! Sua distribuidora de games. Tudo em um só lugar.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={scrollToHighlights}
                className="bg-cyan-300 text-slate-900 px-5 py-2.5 rounded-lg font-semibold hover:bg-cyan-200 transition-colors"
             id="bnt"
             >
                Começar
              </button>
            </div>

            <p className="text-slate-400 mt-4 max-w-2xl">
              Mais de 1000+ jogos disponí­veis
            </p>

            {/* eslint-disable-next-line */}
            <div
              className="slider"
            >
              <div className="list">
                {/* eslint-disable-next-line */}
                <div 
                  className="item item-pos-1"
                >
                  <div className="carde">
                    <img src="/img/img.webp" alt="Capa de jogo destacada 1 - ArenaGames" className="w-full h-full object-cover" />
                  </div>
                </div>
                {/* eslint-disable-next-line */}
                <div
                  className="item item-pos-2"
                >
                  <div className="carde">
                    <img src="/img/img2.webp" alt="Capa de jogo destacada 2 - ArenaGames" className="w-full h-full object-cover" />
                  </div>
                </div>
                {/* eslint-disable-next-line */}
                <div
                  className="item item-pos-3"
                >
                  <div className="carde">
                    <img src="/img/img3.webp" alt="Capa de jogo destacada 3 - ArenaGames" className="w-full h-full object-cover" />
                  </div>
                </div>
                {/* eslint-disable-next-line */}
                <div
                  className="item item-pos-4"
                >
                  <div className="carde">
                    <img src="/img/img4.webp" alt="Capa de jogo destacada 4 - ArenaGames" className="w-full h-full object-cover" />
                  </div>
                </div>
                {/* eslint-disable-next-line */}
                <div
                  className="item item-pos-5"
                >
                  <div className="carde">
                    <img src="/img/img5.webp" alt="Capa de jogo destacada 5 - ArenaGames" className="w-full h-full object-cover" />
                  </div>
                </div>
                {/* eslint-disable-next-line */}
                <div
                  className="item item-pos-6"
                >
                  <div className="carde">
                    <img src="/img/img6.webp" alt="Capa de jogo destacada 6 - ArenaGames" className="w-full h-full object-cover" />
                  </div>
                </div>
                {/* eslint-disable-next-line */}
                <div
                  className="item item-pos-7"
                >
                  <div className="carde">
                    <img src="/img/img7.avif" alt="Capa de jogo destacada 7 - ArenaGames" className="w-full h-full object-cover" />
                  </div>
                </div>
                {/* eslint-disable-next-line */}
                <div
                  className="item item-pos-8"
                >
                  <div className="carde">
                    <img src="/img/img8.webp" alt="Capa de jogo destacada 8 - ArenaGames" className="w-full h-full object-cover" />
                  </div>
                </div>
                {/* eslint-disable-next-line */}
                <div
                  className="item item-pos-9"
                >
                  <div className="carde">
                    <img src="/img/img9.webp" alt="Capa de jogo destacada 9 - ArenaGames" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
       </div>
        {/* Filters Section */}
        <section id="filters-section" className="mb-12" aria-label="SeÃƒÂ§ÃƒÂ£o de filtros de jogos">
          <GameFilters 
            onFiltersChange={setFilters}          />
        </section>

        <section id="highlights-section" aria-labelledby="highlights-heading" role="region">
          <div className="flex items-center justify-between mb-6">
            <h2 id="highlights-heading" className="text-2xl font-semibold">Jogos em alta</h2>
            <span className="text-sm text-slate-400">Atualizado agora</span>
          </div>

          {loading ? (
            <p className="text-center text-slate-500 py-20">
              Carregando jogos...
            </p>
          ) : games.length > 0 ? (
            <>
              <GamesGrid games={games} user={user} />
              <div className="mt-10 flex justify-center gap-4">
                <button
                  onClick={handleLoadLess}
                  disabled={loadingMore || page <= 1}
                  className="bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors disabled:opacity-60"
                >
                  Ver menos
                </button>
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="bg-cyan-300 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-cyan-200 transition-colors disabled:opacity-60"
                >
                  {loadingMore ? "Carregando..." : "Ver mais"}
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-slate-500 py-20">
              Nenhum jogo encontrado no momento.
            </p>
          )}
        </section>
      </main>

      <CookieBanner />
    </div>
  );
}


