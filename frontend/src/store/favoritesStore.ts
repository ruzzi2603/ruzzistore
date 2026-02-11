import { create } from 'zustand';
import api from '@/lib/api';

interface Game {
  id: string | number;
  title: string;
  image?: string;
  originalPrice?: number;
  promotionPrice?: number;
  platform?: string;
  imageUrl?: string;
}

interface FavoritesState {
  favorites: Game[];
  fetchFavorites: () => Promise<void>;
  toggleFavorite: (game: Game) => Promise<void>;
  isFavorite: (gameId: string | number) => boolean;
  clearFavorites: () => void; // <--- ADICIONE ESTA LINHA NA INTERFACE
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],

  fetchFavorites: async () => {
    try {
      const data = await api.get<Game[]>('/favorites');
      set({ favorites: data });
    } catch (error) {
      console.error("Erro ao sincronizar favoritos");
    }
  },

  toggleFavorite: async (game) => {
    const isFav = get().isFavorite(game.id);
    const previousFavorites = get().favorites;

    if (isFav) {
      set({ favorites: previousFavorites.filter(f => f.id !== game.id) });
    } else {
      set({ favorites: [...previousFavorites, game] });
    }

    try {
      await api.post(`/favorites/${game.id}`, {});
    } catch (error) {
      set({ favorites: previousFavorites });
      console.error("Erro ao salvar favorito no servidor");
    }
  },

  isFavorite: (gameId) => get().favorites.some((f) => String(f.id) === String(gameId)),

  // <--- ADICIONE ESTA IMPLEMENTAÇÃO
  clearFavorites: () => {
    set({ favorites: [] });
  },
}));
