import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

type GalleryImage = {
  id: string;
  name: string;
  url: string;
};

const BUCKET_NAME = 'gallery';
const GALLERY_PREFIX = '';

// ── Skeleton Card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="rounded-2xl bg-gray-200 animate-pulse aspect-[4/3]" />
);

// ── Lightbox ─────────────────────────────────────────────────────────────────
const Lightbox: React.FC<{
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}> = ({ images, index, onClose, onPrev, onNext }) => {
  const image = images[index];

  // Close on Escape, navigate with arrow keys
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, onPrev, onNext]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2"
        aria-label="Close"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2 rounded-full bg-white/10 hover:bg-white/20"
          aria-label="Previous"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Image */}
      <div
        className="relative max-w-5xl max-h-[90vh] w-full px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={image.url}
          alt={image.name}
          className="max-h-[85vh] w-full object-contain rounded-xl shadow-2xl"
        />
        {/* Caption */}
        <p className="mt-3 text-center text-xs text-white/60 truncate">
          {image.name.replace(/\.[^.]+$/, '').replace(/_/g, ' ')}
          <span className="ml-3 text-white/30">{index + 1} / {images.length}</span>
        </p>
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2 rounded-full bg-white/10 hover:bg-white/20"
          aria-label="Next"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

// ── Gallery Page ──────────────────────────────────────────────────────────────
const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const loadImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: listError } = await supabase.storage
        .from(BUCKET_NAME)
        .list(GALLERY_PREFIX || undefined);

      if (listError) throw listError;
      if (!data) { setImages([]); return; }

      const publicUrls = data
        .filter((file) =>
          !file.name.startsWith('.') &&
          /\.(jpe?g|png|webp|gif|avif)$/i.test(file.name)
        )
        .map((file) => {
          const path = GALLERY_PREFIX ? `${GALLERY_PREFIX}/${file.name}` : file.name;
          const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
          return { id: file.id ?? file.name, name: file.name, url: publicUrl };
        });

      setImages(publicUrls);
    } catch (err: any) {
      setError(err.message ?? 'Failed to load images.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadImages(); }, []);

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(() =>
    setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null)), [images.length]);
  const nextImage = useCallback(() =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : null)), [images.length]);

  return (
    <>
      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}

      <main className="pt-24 pb-16 bg-[#f9f7f1] min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">

          {/* Header */}
          <header className="mb-10">
            <p className="text-xs font-semibold tracking-[0.25em] text-[#bfa06f] uppercase mb-2">
              Media
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-900 mb-3">
              Gallery
            </h1>
            <p className="text-sm sm:text-base text-gray-700 max-w-2xl">
              Browse visual highlights from our practice, curated and stored securely in Supabase Storage.
            </p>
          </header>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
              {error}
            </div>
          )}

          {/* Grid */}
          <section>
            {loading && images.length === 0 ? (
              // Skeleton loader
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : images.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <svg className="h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5M3 3h18" />
                </svg>
                <p className="text-sm text-gray-500">No images found in the gallery yet.</p>
                <p className="text-xs text-gray-400 mt-1">
                  Add images to the <span className="font-mono">{BUCKET_NAME}</span> bucket in Supabase.
                </p>
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-400 mb-4">{images.length} image{images.length !== 1 ? 's' : ''}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <figure
                      key={image.id}
                      className="group relative overflow-hidden rounded-2xl bg-gray-100 shadow-sm cursor-pointer aspect-[4/3]"
                      onClick={() => openLightbox(index)}
                    >
                      <img
                        src={image.url}
                        alt={image.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                        <svg className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803zM10.5 7.5v6m3-3h-6" />
                        </svg>
                      </div>
                      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent px-3 pb-2 pt-6">
                        <p className="text-[10px] text-white/90 truncate">
                          {image.name.replace(/\.[^.]+$/, '').replace(/_/g, ' ')}
                        </p>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </>
            )}
          </section>

        </div>
      </main>
    </>
  );
};

export default GalleryPage;
