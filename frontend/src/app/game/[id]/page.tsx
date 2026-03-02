'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { GameDescription } from '@/components/GameDescription';

type RawgDetails = {
  id?: number;
  name?: string;
  description_raw?: string;
  released?: string;
  rating?: number;
  metacritic?: number;
  background_image?: string;
  website?: string;
  genres?: Array<{ id: number; name: string }>;
  platforms?: Array<{ platform?: { name?: string } }>;
  developers?: Array<{ id: number; name: string }>;
  publishers?: Array<{ id: number; name: string }>;
};

type RawgMovies = {
  results?: Array<{
    id: number;
    name?: string;
    preview?: string;
    data?: { max?: string; 480?: string };
  }>;
};

type RawgYoutube = {
  results?: Array<{ id: string; name?: string; external_id?: string; channel_id?: string }>;
};

type RawgTwitch = {
  results?: Array<{ id: number; name?: string; external_id?: string; channel?: string }>;
};

type LocalGame = {
  id: number;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  platform?: string;
  url?: string;
  isFree?: boolean;
};

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function parseNumber(value: string | null): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export default function GameDetailsPage() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const gameId = params?.id;
  const numericId = Number(gameId);
  const isNumericId = Number.isFinite(numericId);

  const fallbackTitle = search.get('title') || 'Jogo';
  const fallbackPlatform = search.get('platform') || 'N/A';
  const fallbackUrl = search.get('url') || '';
  const fallbackImage = search.get('imageUrl') || '';
  const fallbackIsFree = search.get('isFree') === 'true';
  const fallbackOriginalPrice = parseNumber(search.get('originalPrice'));
  const fallbackPromotionPrice = parseNumber(search.get('promotionPrice'));

  const [loading, setLoading] = useState(true);
  const [localGame, setLocalGame] = useState<LocalGame | null>(null);
  const [details, setDetails] = useState<RawgDetails | null>(null);
  const [movies, setMovies] = useState<RawgMovies['results']>([]);
  const [youtube, setYoutube] = useState<RawgYoutube['results']>([]);
  const [twitch, setTwitch] = useState<RawgTwitch['results']>([]);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      try {
        const [localRes, detailsRes, moviesRes, ytRes, twitchRes] = await Promise.all([
          fetch(`${API}/games/${gameId}`, { cache: 'no-store' }).catch(() => null),
          isNumericId ? fetch(`${API}/rawg/games/${gameId}`, { cache: 'no-store' }).catch(() => null) : null,
          isNumericId ? fetch(`${API}/rawg/games/${gameId}/movies`, { cache: 'no-store' }).catch(() => null) : null,
          isNumericId ? fetch(`${API}/rawg/games/${gameId}/youtube`, { cache: 'no-store' }).catch(() => null) : null,
          isNumericId ? fetch(`${API}/rawg/games/${gameId}/twitch`, { cache: 'no-store' }).catch(() => null) : null,
        ]);

        if (!active) return;

        if (localRes?.ok) {
          const text = await localRes.text();
          const localData = text ? JSON.parse(text) : null;
          setLocalGame(localData || null);
        }

        if (detailsRes?.ok) {
          const text = await detailsRes.text();
          const rawgData = text ? JSON.parse(text) : null;
          setDetails(rawgData || null);
        }

        if (moviesRes?.ok) {
          const text = await moviesRes.text();
          const moviesData: RawgMovies | null = text ? JSON.parse(text) : null;
          setMovies(Array.isArray(moviesData?.results) ? moviesData.results : []);
        }

        if (ytRes?.ok) {
          const text = await ytRes.text();
          const ytData: RawgYoutube | null = text ? JSON.parse(text) : null;
          setYoutube(Array.isArray(ytData?.results) ? ytData.results : []);
        }

        if (twitchRes?.ok) {
          const text = await twitchRes.text();
          const twitchData: RawgTwitch | null = text ? JSON.parse(text) : null;
          setTwitch(Array.isArray(twitchData?.results) ? twitchData.results : []);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [gameId, isNumericId]);

  const display = useMemo(() => {
    const title = details?.name || localGame?.title || fallbackTitle;
    const image = details?.background_image || localGame?.imageUrl || fallbackImage;
    const description =
      details?.description_raw ||
      localGame?.description ||
      'Sem descricao detalhada para este jogo no momento.';
    const platform =
      localGame?.platform ||
      fallbackPlatform ||
      details?.platforms?.map((p) => p.platform?.name).filter(Boolean).join(', ') ||
      'N/A';
    const externalUrl = details?.website || localGame?.url || fallbackUrl;
    const released = details?.released || null;
    const genres = details?.genres?.map((g) => g.name).filter(Boolean) || [];
    const developers = details?.developers?.map((d) => d.name).filter(Boolean) || [];
    const publishers = details?.publishers?.map((p) => p.name).filter(Boolean) || [];

    return {
      title,
      image,
      description,
      platform,
      externalUrl,
      released,
      genres,
      developers,
      publishers,
      rating: details?.rating ?? null,
      metacritic: details?.metacritic ?? null,
    };
  }, [details, localGame, fallbackTitle, fallbackImage, fallbackPlatform, fallbackUrl]);

  const priceLabel = useMemo(() => {
    if (localGame?.isFree || fallbackIsFree) return 'Gratis';
    if (fallbackPromotionPrice !== null && fallbackOriginalPrice !== null) {
      return `R$ ${fallbackPromotionPrice.toFixed(2)} (de R$ ${fallbackOriginalPrice.toFixed(2)})`;
    }
    if (fallbackOriginalPrice !== null) {
      return `R$ ${fallbackOriginalPrice.toFixed(2)}`;
    }
    return 'Preco sob consulta';
  }, [fallbackIsFree, fallbackOriginalPrice, fallbackPromotionPrice, localGame?.isFree]);

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            Voltar para Dashboard
          </Link>
     
        </div>

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/50">
          <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/80 to-transparent z-10" />
          <div className="relative h-105">
            {display.image ? (
              <Image 
                src={display.image} 
                alt={`Capa do jogo ${display.title} para ${display.platform}`}
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 70vw"
                priority
              />
            ) : (
              <div className="w-full h-full bg-slate-900" aria-label="Imagem não disponível" />
            )}
          </div>
          <div className="absolute inset-0 z-20 p-8 md:p-10 flex flex-col justify-end gap-4">
            <p className="text-cyan-300 uppercase tracking-[0.22em] text-xs font-semibold">Detalhes do jogo</p>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">{display.title}</h1>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 text-slate-100 text-sm">{display.platform}</span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-slate-100 text-sm">{priceLabel}</span>
              {display.released && (
                <span className="px-3 py-1 rounded-full bg-white/10 text-slate-100 text-sm">
                  Lancamento: {display.released}
                </span>
              )}
            </div>
                 {display.externalUrl && (
            <a
            id='btnRW'
              href={display.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-300 text-slate-900 font-semibold hover:bg-cyan-200 transition-colors"
            >
              Abrir pagina oficial
              <ExternalLink size={16} />
            </a>
          )}
          </div>
        </section>

        <GameDescription
          title={display.title}
          description={display.description}
          genres={display.genres}
          releases={display.released ?? undefined}
          rating={display.rating ?? undefined}
          trailers={movies}
        />
      </div>
    </div>
  );
}


