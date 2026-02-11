'use client';

import Link from 'next/link';
import AnimatedSection from '@/components/AnimatedSection';
import { Heart } from 'lucide-react';

export default function LibraryPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <AnimatedSection>
        <h1 className="text-4xl font-semibold text-white mb-2">Minha Biblioteca</h1>
        <p className="text-slate-400 mb-10">Gerencie sua colecao, favoritos e downloads.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/dashboard/library/favorites" className="group">
            <div className="var(--surface) border border-white/10 p-8 rounded-2xl hover:border-cyan-300/50 hover:bg-white/5 transition-all">
              <Heart className="text-cyan-300 mb-4 group-hover:scale-110 transition-transform" size={40} />
              <h2 className="text-xl font-semibold text-white">Meus Favoritos</h2>
              <p className="text-slate-400 text-sm mt-2">Todos os jogos que voce marcou com um coracao.</p>
            </div>
          </Link>
        </div>
      </AnimatedSection>
    </div>
  );
}
