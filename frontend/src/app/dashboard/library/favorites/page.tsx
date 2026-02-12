'use client';

import { useEffect } from 'react';
import { useFavoritesStore } from '@/store/favoritesStore';
import GameCard from '@/components/GameCard';
import AnimatedSection from '@/components/AnimatedSection';
import { HeartOff } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function FavoritesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { favorites, fetchFavorites, toggleFavorite, isFavorite } = useFavoritesStore();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user, fetchFavorites]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen">
      <AnimatedSection>
        <div className="flex items-center gap-4 mb-10">
          <Link href="/dashboard/library" className="text-slate-400 hover:text-white transition-colors">
            Biblioteca
          </Link>
          <span className="text-slate-600">/</span>
          <h1 className="text-2xl font-semibold text-white">Favoritos</h1>
        </div>
      </AnimatedSection>

      {favorites.length === 0 ? (
        <AnimatedSection>
          <div className="flex flex-col items-center justify-center py-20 border border-white/10 rounded-3xl var(--surface)/60">
            <HeartOff size={60} className="text-slate-600 mb-4" />
            <h2 className="text-xl font-medium text-slate-300">Sua lista esta vazia</h2>
            <p className="text-slate-500 mb-6">Favorite alguns jogos no dashboard para ve-los aqui.</p>
            <Link href="/dashboard" className="bg-cyan-300 hover:bg-cyan-200 text-slate-900 px-6 py-2 rounded-lg font-semibold transition-all">
              Explorar Jogos
            </Link>
          </div>
        </AnimatedSection>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((game) => (
            <AnimatedSection key={game.id}>
              <GameCard
                game={game}
                user={user}
                isFavorited={isFavorite(game.id, game.url)}
                onFavoriteToggle={async () => toggleFavorite(game)}
              />
            </AnimatedSection>
          ))}
        </div>
      )}
    </div>
  );
}
