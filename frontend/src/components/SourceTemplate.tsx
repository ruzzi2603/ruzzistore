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

interface SourceTemplateProps {
  endpoint: string;
  title: string;
  brandColor?: string;
}

function mapEndpoint(endpoint: string) {
  if (endpoint.startsWith('/games/source/')) {
    const source = endpoint.replace('/games/source/', '');
    return `/games?source=${encodeURIComponent(source)}`;
  }
  return endpoint;
}

export default function SourceTemplate({ endpoint, title, brandColor }: SourceTemplateProps) {
  const { user } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const apiEndpoint = mapEndpoint(endpoint);
    api
      .get<Game[]>(apiEndpoint)
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
  }, [endpoint]);

  return (
    <div className="source-page">
      <div className="source-header">
        <div>
          <h1 className={`source-title ${brandColor || ''}`}>{title}</h1>
          <p className="source-desc">Explore jogos desta fonte.</p>
        </div>
        <span className="source-badge">{endpoint}</span>
      </div>

      {loading ? (
        <div className="source-loading">Carregando...</div>
      ) : games.length > 0 ? (
        <GamesGrid games={games} user={user} />
      ) : (
        <div className="source-empty">
          <p className="source-empty-text">Nenhum jogo encontrado no momento.</p>
        </div>
      )}
    </div>
  );
}
