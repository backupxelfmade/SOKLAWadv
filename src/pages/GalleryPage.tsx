import React, { useEffect, useRef, useState } from 'react';
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
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);
    setSuccessMsg(null);

    const uploadResults = await Promise.allSettled(
      Array.from(files).map(async (file) => {
        // Sanitize filename: replace spaces with underscores
        const safeName = file.name.replace(/\s+/g, '_');
        const path = GALLERY_PREFIX ? `${GALLERY_PREFIX}/${safeName}` : safeName;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(path, file, { upsert: true });

        if (uploadError) throw new Error(`${file.name}: ${uploadError.message}`);
        return safeName;
      })
    );

    const failures = uploadResults
      .filter((r) => r.status === 'rejected')
      .map((r) => (r as PromiseRejectedResult).reason.message);

    const successes = uploadResults.filter((r) => r.status === 'fulfilled').length;

    if (failures.length > 0) {
      setError(`Some uploads failed:\n${failures.join('\n')}`);
    }

    if (successes > 0) {
      setSuccessMsg(`${successes} image${successes > 1 ? 's' : ''} uploaded successfully.`);
      await loadImages(); // Refresh gallery
    }

    setUploading(false);

    // Reset input so same file can be re-uploaded if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
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

        {/* Upload Area */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <label
            htmlFor="gallery-upload"
            className={`inline-flex items-center gap-2 cursor-pointer rounded-xl px-5 py-2.5 text-sm font-medium transition-colors
              ${uploading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#bfa06f] text-white hover:bg-[#a88a5a]'
              }`}
          >
            {uploading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Uploading…
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0L8 8m4-4l4 4" />
                </svg>
                Upload Images
              </>
            )}
          </label>
          <input
            id="gallery-upload"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            disabled={uploading}
            onChange={handleUpload}
            className="hidden"
          />
          <p className="text-xs text-gray-500">Supports JPG, PNG, WebP, GIF — multiple files allowed</p>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700 whitespace-pre-line">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-xs text-green-700">
            {successMsg}
          </div>
        )}

        {/* Gallery Grid */}
        <section>
          {loading && images.length === 0 ? (
            <p className="text-sm text-gray-600">Loading images…</p>
          ) : images.length === 0 ? (
            <p className="text-sm text-gray-600">
              No images found in the gallery yet. Upload images above or add them to the{' '}
              <span className="font-mono text-[11px]">{BUCKET_NAME}</span> bucket in Supabase.
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
