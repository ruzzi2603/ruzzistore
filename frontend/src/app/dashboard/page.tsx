'use client';

import { useEffect, useState } from 'react';
import GamesGrid from '@/components/Game/GamesGrid';
import { useAuth } from '@/components/context/AuthContext';

interface Game {
  id: number | string;
  title: string;
  imageUrl?: string;
  platform?: string;
  url?: string;
  isFree?: boolean;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const fetchGames = async (pageToLoad: number, isInitial = false) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/games?source=rawg&page=${pageToLoad}`,
        { cache: 'no-store' }
      );
      if (!res.ok) {
        if (isInitial) setGames([]);
        return;
      }
      const data = await res.json();
      const safeData = Array.isArray(data) ? data : [];
      setAllGames(safeData);
      const visibleCount = Math.min(safeData.length, pageToLoad * PAGE_SIZE);
      setGames(safeData.slice(0, visibleCount));
      setPage(pageToLoad);
    } catch {
      if (isInitial) setGames([]);
    } finally {
      if (isInitial) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  useEffect(() => {
    fetchGames(1, true);
  }, []);

  const handleLoadMore = () => {
    fetchGames(page + 1);
  };
  const handleLoadLess = () => {
    if (page <= 1) return;
    const nextPage = page - 1;
    setPage(nextPage);
    setGames(allGames.slice(0, nextPage * PAGE_SIZE));
  };

  return (
    <div className="min-h-screen text-white">
      <main className="w-full px-6 py-10">
        <section className="mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold">Dashboard</h1>
          <p className="text-slate-400 mt-2">Seu hub com novidades e jogos em alta.</p>
        </section>

        <section>
          {loading ? (
            <p className="text-center text-slate-500 py-20">Carregando jogos...</p>
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
                  {loadingMore ? 'Carregando...' : 'Ver mais'}
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
    </div>
  );
}
