import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

type MediaFile = {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
};

const BUCKET_NAME = 'gallery';
const GALLERY_PREFIX = '';

const isVideo = (name: string) => /\.(mp4|mov|webm|ogg|m4v)$/i.test(name);
const isImage = (name: string) => /\.(jpe?g|png|webp|gif|avif)$/i.test(name);

// ── Global Keyframes ──────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
    @keyframes fadeUp  { from { opacity: 0; transform: translateY(32px) } to { opacity: 1; transform: translateY(0) } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.94) }      to { opacity: 1; transform: scale(1) } }
    @keyframes shimmer {
      0%   { background-position: -700px 0 }
      100% { background-position:  700px 0 }
    }
    @keyframes pulse-ring {
      0%   { box-shadow: 0 0 0 0   rgba(191,160,111,0.35) }
      70%  { box-shadow: 0 0 0 10px rgba(191,160,111,0)   }
      100% { box-shadow: 0 0 0 0   rgba(191,160,111,0)    }
    }
    @keyframes spin { to { transform: rotate(360deg) } }
    .shimmer-bg {
      background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
      background-size: 700px 100%;
      animation: shimmer 1.6s infinite linear;
    }
    .animate-spin-slow { animation: spin 1s linear infinite; }
  `}</style>
);

// ── Skeleton Card ─────────────────────────────────────────────────────────────
const SkeletonCard = ({ tall, delay = 0 }: { tall?: boolean; delay?: number }) => (
  <div
    className={`rounded-2xl overflow-hidden ${tall ? 'row-span-2' : ''}`}
    style={{ minHeight: tall ? '460px' : '220px', opacity: 0, animation: `fadeUp 0.5s ease ${delay}ms forwards` }}
  >
    <div className="shimmer-bg w-full h-full rounded-2xl" style={{ minHeight: 'inherit' }} />
  </div>
);

// ── Lightbox ──────────────────────────────────────────────────────────────────
const Lightbox: React.FC<{
  items: MediaFile[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}> = ({ items, index, onClose, onPrev, onNext }) => {
  const item = items[index];
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => { setImgLoaded(false); }, [index]);

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
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 flex items-center justify-center h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-110"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Prev — desktop */}
      {items.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 items-center justify-center h-11 w-11 rounded-full bg-white/10 hover:bg-[#bfa06f]/70 text-white transition-all duration-200 hover:scale-110"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Media */}
      <div
        className="relative w-full max-w-4xl"
        style={{ animation: 'scaleIn 0.28s cubic-bezier(0.34,1.56,0.64,1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Spinner while image loads */}
        {!imgLoaded && item.type === 'image' && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <svg className="animate-spin-slow h-8 w-8 text-[#bfa06f]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        )}

        {item.type === 'video' ? (
          <video
            key={item.url}
            src={item.url}
            controls
            autoPlay
            className="max-h-[82vh] w-full rounded-2xl shadow-2xl bg-black"
            style={{ animation: 'fadeIn 0.3s ease' }}
          />
        ) : (
          <img
            key={item.url}
            src={item.url}
            alt=""
            onLoad={() => setImgLoaded(true)}
            className="max-h-[82vh] w-full object-contain rounded-2xl shadow-2xl"
            style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.35s ease' }}
          />
        )}

        {/* Counter only — no filename */}
        <div className="mt-3 flex items-center justify-end px-1" style={{ animation: 'fadeUp 0.4s ease 0.15s both' }}>
          <span className="text-xs text-white/30">{index + 1} / {items.length}</span>
        </div>

        {/* Mobile nav + dots */}
        {items.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-3">
            <button
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              className="md:hidden flex items-center justify-center h-8 w-8 rounded-full bg-white/10 hover:bg-[#bfa06f]/60 text-white transition-all"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {items.length <= 16 && items.map((_, i) => (
              <span
                key={i}
                className="block h-1.5 rounded-full transition-all duration-300"
                style={{ width: i === index ? '20px' : '6px', backgroundColor: i === index ? '#bfa06f' : 'rgba(255,255,255,0.2)' }}
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

      {/* Next — desktop */}
      {items.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 items-center justify-center h-11 w-11 rounded-full bg-white/10 hover:bg-[#bfa06f]/70 text-white transition-all duration-200 hover:scale-110"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

// ── Media Card ────────────────────────────────────────────────────────────────
const MediaCard: React.FC<{
  item: MediaFile;
  index: number;
  tall: boolean;
  onClick: () => void;
}> = ({ item, index, tall, onClick }) => {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [mediaLoaded, setMediaLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.06 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <figure
      ref={ref}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl cursor-pointer ${tall ? 'row-span-2' : ''} hover:shadow-2xl`}
      style={{
        minHeight: tall ? '460px' : '220px',
        background: '#1a1a2e',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.97)',
        transition: `opacity 0.55s cubic-bezier(0.22,1,0.36,1) ${index * 65}ms,
                     transform 0.55s cubic-bezier(0.22,1,0.36,1) ${index * 65}ms,
                     box-shadow 0.3s ease`,
      }}
    >
      {/* Shimmer while loading */}
      {!mediaLoaded && (
        <div className="absolute inset-0 shimmer-bg z-[1]" style={{ borderRadius: 'inherit' }} />
      )}

      {item.type === 'video' ? (
        <>
          <video
            src={`${item.url}#t=0.5`}
            muted
            playsInline
            preload="metadata"
            onLoadedData={() => setMediaLoaded(true)}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ minHeight: 'inherit' }}
          />
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center z-[2]">
            <span
              className="flex items-center justify-center h-14 w-14 rounded-full bg-black/40 group-hover:bg-[#bfa06f]/90 transition-all duration-300 shadow-xl"
              style={{ animation: mediaLoaded ? 'pulse-ring 2.5s ease-out infinite' : 'none' }}
            >
              <svg className="h-6 w-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </div>
          {/* Video badge */}
          <span className="absolute top-3 left-3 z-[3] text-[9px] font-bold tracking-widest uppercase bg-[#bfa06f] text-white px-2.5 py-1 rounded-full shadow-md">
            Video
          </span>
        </>
      ) : (
        <img
          src={item.url}
          alt=""
          loading="lazy"
          onLoad={() => setMediaLoaded(true)}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          style={{ minHeight: 'inherit', position: 'relative', zIndex: 2 }}
        />
      )}

      {/* Gold inset ring on hover */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none z-[4] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ boxShadow: 'inset 0 0 0 2px rgba(191,160,111,0.55)' }} />

      {/* Hover overlay — gold zoom icon only, no filename */}
      {item.type === 'image' && (
        <div className="absolute inset-x-0 bottom-0 z-[3] px-3 pb-3 flex items-end justify-end
          opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
          transition-all duration-300 ease-out">
          <span className="flex items-center justify-center h-8 w-8 rounded-full bg-[#bfa06f]/80 shadow-lg">
            <svg className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
            </svg>
          </span>
        </div>
      )}
    </figure>
  );
};

// ── Gallery Page ──────────────────────────────────────────────────────────────
const GalleryPage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const loadMedia = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: listError } = await supabase.storage
        .from(BUCKET_NAME)
        .list(GALLERY_PREFIX || undefined);

      if (listError) throw listError;
      if (!data) { setItems([]); return; }

      const media = data
        .filter((f) => !f.name.startsWith('.') && (isImage(f.name) || isVideo(f.name)))
        .map((f) => {
          const path = GALLERY_PREFIX ? `${GALLERY_PREFIX}/${f.name}` : f.name;
          const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
          return {
            id: f.id ?? f.name,
            name: f.name,
            url: publicUrl,
            type: (isVideo(f.name) ? 'video' : 'image') as 'image' | 'video',
          };
        });

      setItems(media);
    } catch (err: any) {
      setError(err.message ?? 'Failed to load media.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadMedia(); }, []);

  const openLightbox  = useCallback((i: number) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevItem = useCallback(() =>
    setLightboxIndex((i) => (i !== null ? (i - 1 + items.length) % items.length : null)), [items.length]);
  const nextItem = useCallback(() =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % items.length : null)), [items.length]);

  const isTall = (i: number) => i % 5 === 0;
  const photoCount = items.filter((f) => f.type === 'image').length;
  const videoCount = items.filter((f) => f.type === 'video').length;

  return (
    <>
      <GlobalStyles />

      {lightboxIndex !== null && (
        <Lightbox items={items} index={lightboxIndex} onClose={closeLightbox} onPrev={prevItem} onNext={nextItem} />
      )}

      {/* ── Blue Banner ── */}
      <section className="relative bg-[#0d1e35] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#bfa06f] to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-28 sm:pt-36 pb-10 sm:pb-14">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-[#bfa06f] transition-colors duration-200 mb-6 group"
            style={{ animation: 'fadeUp 0.5s ease 0.1s both' }}
          >
            <svg className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="flex items-center gap-2.5 mb-3" style={{ animation: 'fadeUp 0.5s ease 0.15s both' }}>
            <span className="block w-7 h-[2px] bg-[#bfa06f]" />
            <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-[#bfa06f] uppercase">Media</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3"
            style={{ animation: 'fadeUp 0.5s ease 0.2s both' }}>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white/90 leading-tight mb-2">Gallery</h1>
              <p className="text-sm text-white/45 max-w-lg leading-relaxed">
                Browse visual highlights from our practice, curated and stored securely in Supabase Storage.
              </p>
            </div>
            {!loading && items.length > 0 && (
              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0"
                style={{ animation: 'fadeIn 0.5s ease 0.4s both' }}>
                {photoCount > 0 && (
                  <span className="text-[11px] font-medium text-[#bfa06f] border border-[#bfa06f]/30 rounded-full px-3 py-1">
                    {photoCount} photo{photoCount !== 1 ? 's' : ''}
                  </span>
                )}
                {videoCount > 0 && (
                  <span className="text-[11px] font-medium text-[#bfa06f] border border-[#bfa06f]/30 rounded-full px-3 py-1">
                    {videoCount} video{videoCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-b from-transparent to-[#f9f7f1]/5 pointer-events-none" />
      </section>

      {/* ── Page Content ── */}
      <main className="bg-[#f9f7f1] min-h-screen pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-8 sm:pt-10">

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700"
              style={{ animation: 'fadeUp 0.4s ease' }}>
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[220px]">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} tall={i % 5 === 0} delay={i * 60} />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 text-center"
              style={{ animation: 'fadeUp 0.5s ease' }}>
              <div className="h-16 w-16 rounded-full bg-[#bfa06f]/10 flex items-center justify-center mb-4">
                <svg className="h-7 w-7 text-[#bfa06f]/50" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5M3 3h18" />
                </svg>
              </div>
              <p className="text-sm font-serif text-gray-700 mb-1">No media yet</p>
              <p className="text-xs text-gray-400">
                Upload images or videos to the <span className="font-mono">{BUCKET_NAME}</span> bucket in Supabase.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[220px]">
              {items.map((item, index) => (
                <MediaCard
                  key={item.id}
                  item={item}
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
