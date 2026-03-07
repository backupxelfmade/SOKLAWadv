import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

type GalleryImage = {
  id: string;
  name: string;
  url: string;
};

const BUCKET_NAME = 'gallery';
const GALLERY_PREFIX = '';

// ── Skeleton Card ─────────────────────────────────────────────────────────────
const SkeletonCard = ({ tall }: { tall?: boolean }) => (
  <div
    className={`rounded-2xl bg-gradient-to-br from-gray-200 to-gray-100 animate-pulse w-full ${tall ? 'row-span-2' : ''}`}
    style={{ minHeight: tall ? '480px' : '220px' }}
  />
);

// ── Lightbox ──────────────────────────────────────────────────────────────────
const Lightbox: React.FC<{
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}> = ({ images, index, onClose, onPrev, onNext }) => {
  const image = images[index];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md px-4"
      style={{ animation: 'fadeIn 0.2s ease' }}
      onClick={onClose}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }
      `}</style>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex items-center justify-center h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
        aria-label="Close"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Prev — hidden on mobile, shown md+ */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 items-center justify-center h-10 w-10 rounded-full bg-white/10 hover:bg-[#bfa06f]/60 text-white transition-all"
          aria-label="Previous"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Image */}
      <div
        className="relative w-full max-w-4xl max-h-[90vh]"
        style={{ animation: 'scaleIn 0.25s ease' }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={image.url}
          alt={image.name}
          className="max-h-[78vh] w-full object-contain rounded-xl shadow-2xl"
        />

        {/* Caption + counter */}
        <div className="mt-3 flex items-center justify-between px-1">
          <p className="text-xs text-white/60 truncate">
            {image.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ')}
          </p>
          <span className="text-xs text-white/30 ml-3 shrink-0">{index + 1} / {images.length}</span>
        </div>

        {/* Mobile swipe hint + dots */}
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-3">
            {/* Mobile prev/next inline */}
            <button
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              className="md:hidden flex items-center justify-center h-8 w-8 rounded-full bg-white/10 hover:bg-[#bfa06f]/60 text-white transition-all"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {images.length <= 12 && images.map((_, i) => (
              <span
                key={i}
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-5 bg-[#bfa06f]' : 'w-1.5 bg-white/25'
                }`}
              />
            ))}

            <button
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="md:hidden flex items-center justify-center h-8 w-8 rounded-full bg-white/10 hover:bg-[#bfa06f]/60 text-white transition-all"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Next — hidden on mobile */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 items-center justify-center h-10 w-10 rounded-full bg-white/10 hover:bg-[#bfa06f]/60 text-white transition-all"
          aria-label="Next"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

// ── Gallery Card ──────────────────────────────────────────────────────────────
const GalleryCard: React.FC<{
  image: GalleryImage;
  index: number;
  tall: boolean;
  onClick: () => void;
}> = ({ image, index, tall, onClick }) => {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <figure
      ref={ref}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl bg-gray-100 cursor-pointer shadow-sm
        ${tall ? 'row-span-2' : ''}
        hover:shadow-lg transition-shadow duration-300`}
      style={{
        minHeight: tall ? '460px' : '220px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.5s ease ${index * 70}ms, transform 0.5s ease ${index * 70}ms, box-shadow 0.3s ease`,
      }}
    >
      <img
        src={image.url}
        alt={image.name}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        style={{ minHeight: 'inherit' }}
      />

      {/* Gold ring on hover */}
      <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 group-hover:ring-[#bfa06f]/50 transition-all duration-300 pointer-events-none" />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between px-3 pb-3">
        <p className="text-[11px] text-white/90 font-medium truncate max-w-[75%] leading-snug">
          {image.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ')}
        </p>
        <span className="flex items-center justify-center h-7 w-7 rounded-full bg-[#bfa06f]/80 shrink-0">
          <svg className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
          </svg>
        </span>
      </div>
    </figure>
  );
};

// ── Gallery Page ──────────────────────────────────────────────────────────────
const GalleryPage: React.FC = () => {
  const navigate = useNavigate();
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

  const openLightbox = useCallback((i: number) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(() =>
    setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null)), [images.length]);
  const nextImage = useCallback(() =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : null)), [images.length]);

  const isTall = (i: number) => i % 5 === 0;

  return (
    <>
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}

      {/* ── Blue Banner ── */}
      <section className="relative bg-[#0d1e35] overflow-hidden">
        {/* Dot texture */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Gold top line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#bfa06f] to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-28 sm:pt-36 pb-10 sm:pb-14">
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-[#bfa06f] transition-colors duration-200 mb-6 group"
          >
            <svg className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          {/* Label */}
          <div className="flex items-center gap-2.5 mb-3">
            <span className="block w-7 h-[2px] bg-[#bfa06f]" />
            <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-[#bfa06f] uppercase">
              Media
            </p>
          </div>

          {/* Title + badge row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white/90 leading-tight mb-2">
                Gallery
              </h1>
              <p className="text-sm text-white/45 max-w-lg leading-relaxed">
                Browse visual highlights from our practice, curated and stored securely in Supabase Storage.
              </p>
            </div>
            {!loading && images.length > 0 && (
              <span className="self-start sm:self-auto text-[11px] font-medium text-[#bfa06f] border border-[#bfa06f]/30 rounded-full px-3 py-1 shrink-0">
                {images.length} image{images.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-b from-transparent to-[#f9f7f1]/5 pointer-events-none" />
      </section>

      {/* ── Page Content ── */}
      <main className="bg-[#f9f7f1] min-h-screen pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-8 sm:pt-10">

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
              {error}
            </div>
          )}

          {/* Grid */}
          {loading && images.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[220px]">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} tall={i % 5 === 0} />)}
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 text-center">
              <div className="h-16 w-16 rounded-full bg-[#bfa06f]/10 flex items-center justify-center mb-4">
                <svg className="h-7 w-7 text-[#bfa06f]/50" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5M3 3h18" />
                </svg>
              </div>
              <p className="text-sm font-serif text-gray-700 mb-1">No images yet</p>
              <p className="text-xs text-gray-400">
                Upload images to the <span className="font-mono">{BUCKET_NAME}</span> bucket in Supabase.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[220px]">
              {images.map((image, index) => (
                <GalleryCard
                  key={image.id}
                  image={image}
                  index={index}
                  tall={isTall(index)}
                  onClick={() => openLightbox(index)}
                />
              ))}
            </div>
          )}

        </div>
      </main>
    </>
  );
};

export default GalleryPage;
