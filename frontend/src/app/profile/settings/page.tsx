'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/context/AuthContext';
import AnimatedSection from '@/components/AnimatedSection';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
    setAvatar(user?.avatar || '');
  }, [user]);

  const handleAvatarFile = async (file?: File) => {
    if (!file) return;
    setAvatarUploading(true);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
        setAvatarUploading(false);
      };
      reader.readAsDataURL(file);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Imagem muito grande (max 2MB)');
      setAvatarUploading(false);
      return;
    }

    try {
      const form = new FormData();
      form.append('file', file);
      form.append('upload_preset', uploadPreset);
      form.append('folder', 'ruzzistore/avatars');

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: form,
      });

      if (!res.ok) {
        throw new Error('Falha no upload');
      }

      const data = await res.json();
      setAvatar(data.secure_url || data.url || '');
      toast.success('Imagem enviada');
    } catch {
      toast.error('Erro ao enviar imagem');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSaveAvatar = async () => {
    setIsSavingAvatar(true);
    try {
      await api.post('/users/avatar', { avatar: avatar || null });
      const refreshed = await api.get<{ id: string; name: string; email: string; avatar?: string; createdAt?: string }>(
        '/users/me',
      );
      updateUser(refreshed);
      setAvatar(refreshed.avatar || '');
      toast.success('Foto atualizada com sucesso');
    } catch {
      toast.error('Erro ao atualizar foto');
    } finally {
      setIsSavingAvatar(false);
    }
  };

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
            <label className="block text-slate-500 text-sm mb-3">Foto de perfil</label>
            <div className="flex items-center gap-4">
              <img
                src={avatar || `https://ui-avatars.com/api/?name=${name || user?.name || 'User'}&background=0f1720&color=22d3ee`}
                alt="Avatar"
                className="w-16 h-16 rounded-xl object-cover border border-white/10"
              />
              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleAvatarFile(e.target.files?.[0])}
                  className="w-full text-sm text-slate-300 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-cyan-300 file:text-slate-900 file:font-semibold"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveAvatar}
                    disabled={avatarUploading || isSavingAvatar}
                    className="bg-cyan-300 hover:bg-cyan-200 text-slate-900 font-semibold px-4 py-2 rounded-lg transition-all disabled:opacity-50"
                  >
                    {avatarUploading ? 'Enviando...' : isSavingAvatar ? 'Salvando...' : 'Salvar foto'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAvatar('')}
                    className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg border border-white/10 transition-all"
                  >
                    Remover foto
                  </button>
                </div>
              </div>
            </div>
          </div>

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
