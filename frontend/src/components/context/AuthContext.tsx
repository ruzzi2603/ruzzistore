'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie, destroyCookie } from 'nookies';
import api from '@/lib/api';
import { useFavoritesStore } from '@/store/favoritesStore';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (credentials: any) => Promise<void>;
  signOut: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { fetchFavorites, clearFavorites } = useFavoritesStore();

  useEffect(() => {
    async function loadStorageData() {
      const token = localStorage.getItem('@RuzziStore:token');
      const storagedUser = localStorage.getItem('@RuzziStore:user');

      if (token && storagedUser) {
        setUser(JSON.parse(storagedUser));
        await fetchFavorites();
      }

      setLoading(false);
    }

    loadStorageData();
  }, [fetchFavorites]);

  const signIn = async ({ email, password }: any) => {
    try {
      const response = await api.post<{ accessToken: string; user: User }>('/auth/login', { email, password });
      const { accessToken, user: userData } = response;

      if (!accessToken) {
        throw new Error('Falha na autenticacao');
      }

      localStorage.setItem('@RuzziStore:token', accessToken);
      localStorage.setItem('@RuzziStore:user', JSON.stringify(userData));
      setCookie(undefined, 'ruzzistore.token', accessToken, {
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      setUser(userData);
      await fetchFavorites();

      toast.success(`Bem-vindo de volta, ${userData.name}!`);
      router.push('/dashboard');
    } catch (error) {
      toast.error('Erro no login. Verifique suas credenciais.');
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem('@RuzziStore:token');
    localStorage.removeItem('@RuzziStore:user');
    destroyCookie(undefined, 'ruzzistore.token');
    setUser(null);

    clearFavorites();

    router.push('/login');
    toast.success('Sessao encerrada.');
  };

  const updateUser = (updated: User) => {
    setUser(updated);
    localStorage.setItem('@RuzziStore:user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
