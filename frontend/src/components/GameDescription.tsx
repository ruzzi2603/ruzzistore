'use client';

import { useState } from 'react';
import { X, Play } from 'lucide-react';

interface TrailerModalProps {
  isOpen: boolean;
  videoUrl?: string;
  trailerName?: string;
  onClose: () => void;
  gameName?: string;
}

export default function TrailerModal({
  isOpen,
  videoUrl,
  trailerName,
  onClose,
  gameName,
}: TrailerModalProps) {
  if (!isOpen || !videoUrl) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="trailer-modal-title"
    >
      <div className="relative w-full max-w-4xl mx-4 bg-slate-900 rounded-lg overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          aria-label="Fechar trailer"
          title="Fechar (Esc)"
        >
          <X size={24} />
        </button>

        {/* Title */}
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 id="trailer-modal-title" className="text-xl font-semibold text-white">
            {trailerName || `Trailer de ${gameName}`}
          </h2>
        </div>

        {/* Video Container */}
        <div className="relative w-full bg-black pt-[56.25%]">
          <video
            src={videoUrl}
            controls
            autoPlay
            className="absolute top-0 left-0 w-full h-full"
            aria-label={`Vídeo: ${trailerName || gameName}`}
          />
        </div>

        {/* Instructions */}
        <div className="px-6 py-3 bg-slate-800/50 text-sm text-slate-400">
          Pressione <kbd className="px-2 py-1 bg-slate-700 rounded">Esc</kbd> ou clique fora para fechar
        </div>
      </div>
    </div>
  );
}

interface GameDescriptionProps {
  title: string;
  description?: string;
  genres?: string[];
  releases?: string;
  rating?: number;
  trailers?: Array<{
    id: number;
    name?: string;
    preview?: string;
    data?: { max?: string; '480'?: string };
  }>;
}

export function GameDescription({
  title,
  description,
  genres,
  releases,
  rating,
  trailers,
}: GameDescriptionProps) {
  const [selectedTrailerIndex, setSelectedTrailerIndex] = useState<number | null>(null);
  const selectedTrailer = selectedTrailerIndex !== null ? trailers?.[selectedTrailerIndex] : null;
  const trailerUrl = selectedTrailer?.data?.max || selectedTrailer?.data?.['480'];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSelectedTrailerIndex(null);
    }
  };

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

        {/* Trailers Section */}
        {trailers && trailers.length > 0 && (
          <article className="rounded-2xl border border-white/10 bg-(--surface)/80 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Play size={20} className="text-cyan-300" />
              <h2 className="text-2xl font-semibold text-white">Trailers e Clipes</h2>
            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              role="region"
              aria-label="Trailers disponíveis"
            >
              {trailers.map((trailer, index) => (
                <button
                  key={trailer.id}
                  onClick={() => setSelectedTrailerIndex(index)}
                  onKeyDown={handleKeyDown}
                  className="relative group rounded-lg overflow-hidden border border-slate-700 hover:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20"
                  aria-label={`Assistir trailer: ${trailer.name || `Trailer ${index + 1}`}`}
                >
                  {/* Thumbnail */}
                  {trailer.preview && (
                    <img
                      src={trailer.preview}
                      alt={`Miniatura do trailer: ${trailer.name || `Trailer ${index + 1}`}`}
                      className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="bg-cyan-400 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                      <Play size={24} fill="currentColor" className="text-slate-900" />
                    </div>
                  </div>

                  {/* Title */}
                  {trailer.name && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-linear-to-t from-black to-transparent">
                      <p className="text-sm font-semibold text-white truncate">{trailer.name}</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </article>
        )}
      </section>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={selectedTrailerIndex !== null}
        videoUrl={trailerUrl}
        trailerName={selectedTrailer?.name}
        gameName={title}
        onClose={() => setSelectedTrailerIndex(null)}
      />
    </>
  );
}
