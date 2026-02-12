'use client';

import Image from 'next/image';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface GameCardProps {
  game: {
    id: string | number;
    title: string;
    image?: string;
    imageUrl?: string;
    originalPrice?: number;
    promotionPrice?: number;
    platform?: string;
    url?: string;
    isFree?: boolean;
  };
  isFavorited?: boolean;
  onFavoriteToggle?: (id: string | number) => Promise<void>;
  user?: any;
}

const GameCard = ({ game, isFavorited = false, onFavoriteToggle, user }: GameCardProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Voce precisa logar para favoritar.');
      return;
    }

    if (onFavoriteToggle) {
      setLoading(true);
      await onFavoriteToggle(game.id);
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    if (game.url && typeof window !== 'undefined') {
      window.open(game.url, '_blank', 'noopener,noreferrer');
    }
  };

  const originalPrice = game.originalPrice ?? 0;
  const promoPrice = game.promotionPrice ?? 0;
  const hasOriginalPrice = typeof game.originalPrice === 'number';
  const hasPromoPrice = typeof game.promotionPrice === 'number';
  const discount =
    hasOriginalPrice && hasPromoPrice && originalPrice > 0
      ? Math.round(((originalPrice - promoPrice) / originalPrice) * 100)
      : 0;

  const showFree = game.isFree === true;
  const showUnknownPrice = !showFree && !hasOriginalPrice && !hasPromoPrice;

  return (
    <div
      className="game-card-root group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      role={game.url ? 'button' : undefined}
    >
      {discount > 0 && (
        <div className="game-card-badge">
          -{discount}%
        </div>
      )}

      <button
        onClick={handleFavoriteClick}
        disabled={loading}
        className={`game-card-fav ${
          isFavorited
            ? 'game-card-fav-active'
            : 'game-card-fav-inactive'
        }`}
      >
        <Heart
          size={18}
          fill={isFavorited ? 'currentColor' : 'none'}
          className={loading ? 'animate-pulse' : ''}
        />
      </button>

      <div className="game-card-media">
        <Image
          src={game.image || game.imageUrl || 'https://picsum.photos/seed//800/450'}
          alt={game.title}
          fill
          className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        <div className="game-card-media-overlay" />
      </div>

      <div className="game-card-body">
        <div className="game-card-meta">
          <span className="game-card-platform">
            {game.platform || 'plataforma'}
          </span>
          <div className="game-card-rating">
            <Star size={12} fill="currentColor" />
            <span className="game-card-rating-text">4.8</span>
          </div>
        </div>

        <h3 className="game-card-title">
          {game.title}
        </h3>

        <div className="game-card-footer">
          <div className="game-card-price">
            {hasPromoPrice && hasOriginalPrice ? (
              <>
                <span className="game-card-price-old">R$ {originalPrice.toFixed(2)}</span>
                <span className="game-card-price-new">R$ {promoPrice.toFixed(2)}</span>
              </>
            ) : showFree ? (
              <span className="game-card-price-free">Gratis</span>
            ) : showUnknownPrice ? (
              <span className="game-card-price-unknown">Preco nao informado</span>
            ) : (
              <span className="game-card-price-new">R$ {originalPrice.toFixed(2)}</span>
            )}
          </div>

          <button className="game-card-cart">
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export { GameCard };
export default GameCard;

