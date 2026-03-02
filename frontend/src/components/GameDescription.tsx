'use client';

import { useState } from 'react';
import { X, Play } from 'lucide-react';



interface GameDescriptionProps {
  title: string;
  description?: string;
  genres?: string[];
  releases?: string;
  rating?: number;
}

export function GameDescription({
  title,
  description,
  genres,
  releases,
  rating,
}: GameDescriptionProps) {
 ;



  return (
    <>
      <section
        className="space-y-6"
        role="region"
        aria-label="Informações detalhadas do jogo"
      >
        {/* Description Section */}
        <article className="rounded-2xl border border-white/10 bg-(--surface)/80 p-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">Sobre o Jogo</h2>
          <div className="space-y-4">
            {description && (
              <p className="text-slate-300 leading-relaxed whitespace-pre-line text-justify">
                {description}
              </p>
            )}

            {/* Game Metadata */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
              {rating && (
                <div>
                  <p className="text-sm text-slate-400 uppercase font-semibold">Avaliação</p>
                  <p className="text-lg font-bold text-cyan-300">{rating.toFixed(1)}/10</p>
                </div>
              )}

              {releases && (
                <div>
                  <p className="text-sm text-slate-400 uppercase font-semibold">Lançamento</p>
                  <p className="text-lg font-semibold text-slate-200">{releases}</p>
                </div>
              )}

              {genres && genres.length > 0 && (
                <div className="col-span-2">
                  <p className="text-sm text-slate-400 uppercase font-semibold mb-2">Gêneros</p>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-sm font-medium"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>
  
      </section>

      
    </>
  );
}
