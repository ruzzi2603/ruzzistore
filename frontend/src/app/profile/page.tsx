'use client';

import { useAuth } from '@/components/context/AuthContext';
import AnimatedSection from '@/components/AnimatedSection';
import Loader from '@/components/Loader';
import Link from 'next/link';
import { Settings, User as UserIcon, Mail, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-zinc-500 mb-4">Você precisa estar logado para ver esta página.</p>
        <Link href="/login" className="bg-green-600 px-6 py-2 rounded-lg font-bold">Ir para Login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 py-12">
      <AnimatedSection>
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Meu <span className="text-green-500">Perfil</span></h1>
          <Link href="/profile/settings" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800">
            <Settings size={18} />
            <span>Editar</span>
          </Link>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="h-32 gradient from-green-900 to-zinc-900"></div>
          <div className="px-8 pb-8">
            <div className="relative -mt-12 mb-6">
              <img 
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=18181b&color=22c55e`} 
                alt={user.name}
                className="w-24 h-24 rounded-2xl border-4 border-zinc-900 shadow-xl object-cover"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-zinc-400">
                  <UserIcon size={20} className="text-green-500" />
                  <div>
                    <p className="text-xs uppercase font-bold tracking-widest text-zinc-600">Nome Completo</p>
                    <p className="text-white font-medium">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-zinc-400">
                  <Mail size={20} className="text-green-500" />
                  <div>
                    <p className="text-xs uppercase font-bold tracking-widest text-zinc-600">E-mail</p>
                    <p className="text-white font-medium">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-zinc-400">
                  <Shield size={20} className="text-green-500" />
                  <div>
                    <p className="text-xs uppercase font-bold tracking-widest text-zinc-600">Status da Conta</p>
                    <p className="text-white font-medium">Membro RuzziStore</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}