"use client";

import { useEffect, useState, type CSSProperties } from "react";
import GamesGrid from "@/components/Game/GamesGrid";
import CookieBanner from "@/components/CookieBanner";
import { useAuth } from "@/components/context/AuthContext";

interface Game {
  id: number | string;
  title: string;
  imageUrl?: string;
  platform?: string;
  url?: string;
  isFree?: boolean;
}

export default function Home() {
  const { user } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [latestGames, setLatestGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingLatest, setLoadingLatest] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [showLatest, setShowLatest] = useState(false);
  const PAGE_SIZE = 20;

  const fetchGames = async (pageToLoad: number, isInitial = false) => {
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

  const fetchLatest = async () => {
    setShowLatest(true);
    if (latestGames.length > 0) {
      document
        .getElementById("latest-section")
        ?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setLoadingLatest(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/games/rawg-latest?count=40`,
        { cache: "no-store" },
      );
      if (!res.ok) {
        setLatestGames([]);
        return;
      }
      const data = await res.json();
      setLatestGames(data);
      setTimeout(() => {
        document
          .getElementById("latest-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    } catch {
      setLatestGames([]);
    } finally {
      setLoadingLatest(false);
    }
  };

  const goToHighlights = () => {
    setShowLatest(false);
    setTimeout(() => {
      document
        .getElementById("highlights-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 50);
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
        <section className="mb-12" id="princ">
          <div className="rounded-3xl " id="dvtn">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Colecao
            </p>

            <h1 className="text-4xl md:text-5xl font-semibold mt-3 text-white inline-flex items-center gap-3">
              <span>Plataforma de jogos digitais</span>
            </h1>

            <p className="text-slate-400 mt-4 max-w-2xl">
              Explore titulos famosos e muitos outros, adicicione favoritos e
              descubra novos jogos! Tudo em um só lugar.
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
              Mais de 1000+ jogos disponíveis
            </p>

            <div
              className="slider"
              style={
                {
                  "--width": "250px",
                  "--height": "300px",
                  "--quantity": 9,
                } as CSSProperties
              }
            >
              <div className="list">
                <div
                  className="item"
                  style={{ "--position": 1 } as CSSProperties}
                >
                  <div className="carde">
                    <img src="/img/img.webp" alt="Game Cover" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div
                  className="item"
                  style={{ "--position": 2 } as CSSProperties}
                >
                  <div className="carde">
                    <img src="/img/img2.webp" alt="Game Cover" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div
                  className="item"
                  style={{ "--position": 3 } as CSSProperties}
                >
                  <div className="carde">
                    <img src="/img/img3.webp" alt="Game Cover" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div
                  className="item"
                  style={{ "--position": 4 } as CSSProperties}
                >
                  <div className="carde">
                    <img src="/img/img4.webp" alt="Game Cover" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div
                  className="item"
                  style={{ "--position": 5 } as CSSProperties}
                >
                  <div className="carde">
                    <img src="/img/img5.webp" alt="Game Cover" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div
                  className="item"
                  style={{ "--position": 6 } as CSSProperties}
                >
                  <div className="carde">
                    <img src="/img/img6.webp" alt="Game Cover" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div
                  className="item"
                  style={{ "--position": 7 } as CSSProperties}
                >
                  <div className="carde">
                    <img src="/img/img7.avif" alt="Game Cover" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div
                  className="item"
                  style={{ "--position": 8 } as CSSProperties}
                >
                  <div className="carde">
                    <img src="/img/img8.webp" alt="Game Cover" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div
                  className="item"
                  style={{ "--position": 9 } as CSSProperties}
                >
                  <div className="carde">
                    <img src="/img/img9.webp" alt="Game Cover" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="highlights-section">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Jogos em alta</h2>
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
