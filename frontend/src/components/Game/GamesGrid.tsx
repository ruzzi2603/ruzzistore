'use client';

import { useEffect } from 'react';
import { GameCard } from '../GameCard';
import { useFavoritesStore } from '@/store/favoritesStore';

interface Game {
  id: string | number;
  title: string;
  image?: string;
  imageUrl?: string;
  originalPrice?: number;
  promotionPrice?: number;
  platform?: string;
  url?: string;
  isFree?: boolean;
}

interface GamesGridProps {
  games: Game[];
  user: any;
}

export default function GamesGrid({ games, user }: GamesGridProps) {
  const { favorites, fetchFavorites, toggleFavorite, isFavorite } = useFavoritesStore();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user, fetchFavorites]);

  return (
    <div className="games-grid">
      <div className="games-grid-inner">
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            user={user}
            isFavorited={isFavorite(game.id)}
            onFavoriteToggle={async () => toggleFavorite(game)}
          />
        ))}
      </div>
    </div>
  );
}
