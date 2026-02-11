'use client';

import { useState } from 'react';
import { useAuth } from '@/components/context/AuthContext';
import AnimatedSection from '@/components/AnimatedSection';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const updated = await api.post<{ id: string; name: string; email: string; avatar?: string; createdAt?: string }>(
        '/users/update',
        { name },
      );
      updateUser(updated);
      toast.success('Perfil atualizado com sucesso');
    } catch {
      toast.error('Erro ao atualizar perfil');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <AnimatedSection>
        <h1 className="text-3xl font-semibold text-white mb-8">Configuracoes</h1>

        <form onSubmit={handleUpdate} className="space-y-6 bg-[var(--surface)] p-8 rounded-2xl border border-white/10">
          <div>
            <label className="block text-slate-500 text-sm mb-2">Nome de exibicao</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-cyan-300 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-slate-500 text-sm mb-2">E-mail (nao editavel)</label>
            <input
              type="text"
              value={user?.email}
              disabled
              className="w-full bg-[#0b1118] border border-white/10 rounded-lg p-3 text-slate-500 cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="w-full bg-cyan-300 hover:bg-cyan-200 text-slate-900 font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
          >
            {isUpdating ? 'Salvando...' : 'Salvar alteracoes'}
          </button>
        </form>
      </AnimatedSection>
    </div>
  );
}
