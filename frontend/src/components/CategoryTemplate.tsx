'use client';

import { useEffect, useState } from 'react';
import GamesGrid from '@/components/Game/GamesGrid';
import api from '@/lib/api';
import { useAuth } from '@/components/context/AuthContext';

interface Game {
  id: number | string;
  title: string;
  imageUrl?: string;
  platform?: string;
  url?: string;
  isFree?: boolean;
}

interface CategoryTemplateProps {
  slug: string;
  title: string;
  description?: string;
}

export default function CategoryTemplate({ slug, title, description }: CategoryTemplateProps) {
  const { user } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .get<Game[]>(`/games?category=${encodeURIComponent(slug)}`)
      .then((data) => {
        if (!mounted) return;
        setGames(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!mounted) return;
        setGames([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [slug]);

  return (
    <div className="category-page">
      <div className="category-header">
        <h1 className="category-title">
          {title} <span className="category-title-accent">Games</span>
        </h1>
        {description && <p className="category-desc">{description}</p>}
      </div>

      {loading ? (
        <div className="category-loading">Carregando...</div>
      ) : games.length > 0 ? (
        <GamesGrid games={games} user={user} />
      ) : (
        <div className="category-empty">
          <p className="category-empty-text">Nenhum jogo encontrado no momento.</p>
        </div>
      )}
    </div>
  );
}
