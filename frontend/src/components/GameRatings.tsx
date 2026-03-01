'use client';

import { Star } from 'lucide-react';

interface RatingsProps {
  rating?: number;
  metacritic?: number;
  reviewCount?: number;
  userRating?: number;
}

export default function GameRatings({
  rating,
  metacritic,
  reviewCount,
  userRating,
}: RatingsProps) {
  const getRatingColor = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRatingBgColor = (score: number) => {
    if (score >= 8) return 'bg-green-400/10 border-green-400/30';
    if (score >= 6) return 'bg-yellow-400/10 border-yellow-400/30';
    return 'bg-red-400/10 border-red-400/30';
  };

  return (
    <div className="grid grid-cols-2 gap-3" role="group" aria-label="Avaliações do jogo">
      {/* RAWG Rating */}
      {rating !== undefined && rating !== null && (
        <div
          className={`rounded-lg border p-3 text-center ${getRatingBgColor(rating)}`}
          aria-label={`Avaliação RAWG: ${rating.toFixed(1)} de 10`}
        >
          <div className="flex items-center justify-center gap-1 mb-1">
            <Star size={14} className={`${getRatingColor(rating)}`} fill="currentColor" />
            <span className={`text-sm font-semibold ${getRatingColor(rating)}`}>
              {rating.toFixed(1)}
            </span>
          </div>
          <p className="text-xs text-slate-400">RAWG</p>
        </div>
      )}

      {/* Metacritic Score */}
      {metacritic !== undefined && metacritic !== null && (
        <div
          className={`rounded-lg border p-3 text-center ${getRatingBgColor(metacritic)}`}
          aria-label={`Pontuação Metacritic: ${metacritic}`}
        >
          <div className="flex items-center justify-center gap-1 mb-1">
            <span className={`text-sm font-semibold ${getRatingColor(metacritic)}`}>
              {metacritic}
            </span>
          </div>
          <p className="text-xs text-slate-400">Metacritic</p>
        </div>
      )}

      {/* User Rating */}
      {userRating !== undefined && userRating !== null && (
        <div
          className={`rounded-lg border p-3 text-center ${getRatingBgColor(userRating)}`}
          aria-label={`Avaliação dos usuários: ${userRating.toFixed(1)}`}
        >
          <div className="flex items-center justify-center gap-1 mb-1">
            <Star size={14} className={`${getRatingColor(userRating)}`} fill="currentColor" />
            <span className={`text-sm font-semibold ${getRatingColor(userRating)}`}>
              {userRating.toFixed(1)}
            </span>
          </div>
          <p className="text-xs text-slate-400">Usuários</p>
        </div>
      )}

      {/* Review Count Badge */}
      {reviewCount && reviewCount > 0 && (
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-center">
          <p className="text-xs text-slate-400">
            <span className="text-sm font-semibold text-slate-200">{reviewCount}</span>
            <br />
            Avaliações
          </p>
        </div>
      )}
    </div>
  );
}

// Component para mostrar avaliações inline dentro de um card
export function CompactRating({ rating, size = 'sm' }: { rating?: number; size?: 'sm' | 'md' }) {
  if (!rating) return null;

  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <div className="flex items-center gap-1" aria-label={`Avaliação: ${rating.toFixed(1)}`}>
      <Star size={iconSize} fill="currentColor" className="text-yellow-400" />
      <span className={`${textSize} font-semibold text-slate-200`}>{rating.toFixed(1)}</span>
    </div>
  );
}
