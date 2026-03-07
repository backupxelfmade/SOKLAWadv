import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type GalleryImage = {
  id: string;
  name: string;
  url: string;
};

const BUCKET_NAME = 'gallery';
const GALLERY_PREFIX = '';

const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: listError } = await supabase.storage
        .from(BUCKET_NAME)
        .list(GALLERY_PREFIX || undefined);

      if (listError) throw listError;

      if (!data) {
        setImages([]);
        return;
      }

      const publicUrls = data
        .filter((file) => !file.name.startsWith('.'))
        .map((file) => {
          const path = GALLERY_PREFIX ? `${GALLERY_PREFIX}/${file.name}` : file.name;
          const {
            data: { publicUrl },
          } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);

          return {
            id: file.id ?? file.name,
            name: file.name,
            url: publicUrl,
          };
        });

      setImages(publicUrls);
    } catch (err: any) {
      setError(err.message ?? 'Failed to load images.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadImages();
  }, []);

  return (
    <main className="pt-24 pb-16 bg-[#f9f7f1] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
        <header className="mb-8">
          <p className="text-xs font-semibold tracking-[0.25em] text-[#bfa06f] uppercase mb-2">
            Media
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-900 mb-3">
            Gallery
          </h1>
          <p className="text-sm sm:text-base text-gray-700 max-w-2xl">
            Browse visual highlights from our practice, curated and stored securely in Supabase
            Storage.
          </p>
        </header>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
            {error}
          </div>
        )}

        <section>
          {loading && images.length === 0 ? (
            <p className="text-sm text-gray-600">Loading images…</p>
          ) : images.length === 0 ? (
            <p className="text-sm text-gray-600">
              No images found in the gallery yet. Add images to the{' '}
              <span className="font-mono text-[11px]">{BUCKET_NAME}</span> bucket in Supabase to
              display them here.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((image) => (
                <figure
                  key={image.id}
                  className="group relative overflow-hidden rounded-2xl bg-gray-100 shadow-sm"
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent px-3 pb-2 pt-6">
                    <p className="text-[10px] text-white/90 truncate">{image.name}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default GalleryPage;

