import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar, User, ArrowLeft, Share2, BookOpen,
} from 'lucide-react';
import { getBlogPostBySlug, BlogPost } from '../services/caisyApi';
import Footer from '../components/Footer';

// ── Global Styles ─────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @keyframes fadeIn  { from { opacity: 0 }                              to { opacity: 1 } }
    @keyframes fadeUp  { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
    @keyframes shimmer {
      0%   { background-position: -700px 0 }
      100% { background-position:  700px 0 }
    }
    .shimmer-bg {
      background: linear-gradient(90deg, #e8e2d8 25%, #f0ece3 50%, #e8e2d8 75%);
      background-size: 700px 100%;
      animation: shimmer 1.6s infinite linear;
    }
    .dark-shimmer-bg {
      background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 75%);
      background-size: 700px 100%;
      animation: shimmer 1.6s infinite linear;
    }
  `}</style>
);

// ── Loading Skeleton ──────────────────────────────────────────────────────────
const LoadingSkeleton = () => (
  <>
    <GlobalStyles />
    <div className="min-h-screen bg-white w-full overflow-x-hidden">
      <div className="bg-[#0d2340] pt-24 sm:pt-28 pb-10 sm:pb-14 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#bfa06f] to-transparent" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="dark-shimmer-bg h-3 w-16 rounded-full mb-6" />
          <div className="dark-shimmer-bg h-5 w-24 rounded-full mb-4" />
          <div className="dark-shimmer-bg h-8 w-3/4 rounded-xl mb-3" />
          <div className="dark-shimmer-bg h-8 w-1/2 rounded-xl mb-6" />
          <div className="flex gap-4">
            <div className="dark-shimmer-bg h-3 w-28 rounded-full" />
            <div className="dark-shimmer-bg h-3 w-20 rounded-full" />
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-4">
        <div className="shimmer-bg w-full aspect-video rounded-2xl" />
        <div className="shimmer-bg h-4 w-full rounded-full" />
        <div className="shimmer-bg h-4 w-5/6 rounded-full" />
        <div className="shimmer-bg h-4 w-full rounded-full" />
        <div className="shimmer-bg h-4 w-3/4 rounded-full" />
        <div className="shimmer-bg h-4 w-full rounded-full" />
        <div className="shimmer-bg h-4 w-5/6 rounded-full" />
        <div className="shimmer-bg h-4 w-2/3 rounded-full" />
      </div>
    </div>
    <Footer />
  </>
);

// ── Error State ───────────────────────────────────────────────────────────────
const ErrorState = ({ message }: { message: string }) => (
  <>
    <div className="min-h-screen bg-white flex items-center justify-center pt-20 px-4 w-full overflow-x-hidden">
      <div className="text-center max-w-sm" style={{ animation: 'fadeUp 0.5s ease' }}>
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#bfa06f]/10 mx-auto mb-4">
          <BookOpen className="h-6 w-6 text-[#bfa06f]" />
        </div>
        <span className="block w-6 h-[2px] bg-[#bfa06f] mx-auto mb-3" />
        <h1 className="text-lg font-bold text-[#0d2340] mb-2">Post Not Found</h1>
        <p className="text-xs sm:text-sm text-[#6a6a6a] mb-6 leading-relaxed">{message}</p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 bg-[#bfa06f] hover:bg-[#a08a5f] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Insights
        </Link>
      </div>
    </div>
    <Footer />
  </>
);

// ── Main Component ────────────────────────────────────────────────────────────
const BlogPostDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) { setError('No post slug provided'); setLoading(false); return; }
      try {
        setLoading(true);
        setError(null);
        const data = await getBlogPostBySlug(slug);
        if (!data) setError("The post you're looking for doesn't exist or has been removed.");
        else setPost(data);
      } catch (err) {
        setError('Failed to load blog post. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleShare = async () => {
    if (navigator.share && post) {
      try { await navigator.share({ title: post.title, url: window.location.href }); } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (error || !post) return <ErrorState message={error ?? 'Post not found.'} />;

  return (
    <>
      <GlobalStyles />
      <div className="min-h-screen bg-white w-full overflow-x-hidden">

        {/* ── Dark Banner ── */}
        <section
          className="bg-[#0d2340] pt-24 sm:pt-28 pb-10 sm:pb-14 relative overflow-hidden"
          style={{ animation: 'fadeIn 0.4s ease' }}
        >
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#bfa06f] to-transparent" />
          <div
            className="hidden lg:block absolute right-0 top-0 bottom-0 w-[38%] opacity-[0.04] pointer-events-none"
            style={{ backgroundImage: 'repeating-linear-gradient(-55deg, #bfa06f 0px, #bfa06f 1px, transparent 1px, transparent 28px)' }}
          />
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

            {/* Breadcrumb */}
            <div
              className="flex items-center gap-1.5 mb-5 sm:mb-7 flex-wrap"
              style={{ animation: 'fadeUp 0.5s ease 0.05s both' }}
            >
              <Link to="/blog" className="group inline-flex items-center gap-1 text-white/40 hover:text-white text-[0.65rem] sm:text-xs font-medium transition-colors">
                <ArrowLeft className="h-2.5 w-2.5 group-hover:-translate-x-0.5 transition-transform" />
                Back
              </Link>
              <span className="text-white/20 text-[0.65rem]">/</span>
              <Link to="/" className="text-white/35 hover:text-white/70 text-[0.65rem] sm:text-xs transition-colors">Home</Link>
              <span className="text-white/20 text-[0.65rem]">/</span>
              <Link to="/blog" className="text-white/35 hover:text-white/70 text-[0.65rem] sm:text-xs transition-colors">Insights</Link>
              <span className="text-white/20 text-[0.65rem]">/</span>
              <span className="text-white/35 text-[0.65rem] sm:text-xs truncate max-w-[160px] sm:max-w-xs">{post.title}</span>
            </div>

            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-3" style={{ animation: 'fadeUp 0.5s ease 0.1s both' }}>
              <span className="block h-px w-6 sm:w-8 bg-[#bfa06f]" />
              <span className="text-[0.6rem] sm:text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#bfa06f]">
                Insights
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-4 sm:mb-6"
              style={{ animation: 'fadeUp 0.5s ease 0.15s both' }}
            >
              {post.title}
            </h1>

            {/* Meta */}
            <div
              className="flex items-center flex-wrap gap-3 sm:gap-5"
              style={{ animation: 'fadeUp 0.5s ease 0.2s both' }}
            >
              {post.publishedDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 text-[#bfa06f] shrink-0" />
                  <span className="text-[0.65rem] sm:text-xs text-white/50">{formatDate(post.publishedDate)}</span>
                </div>
              )}
              {post.author && (
                <div className="flex items-center gap-1.5">
                  <User className="h-3 w-3 text-[#bfa06f] shrink-0" />
                  <span className="text-[0.65rem] sm:text-xs text-white/50">{post.author}</span>
                </div>
              )}
              <button
                onClick={handleShare}
                className="ml-auto flex items-center gap-1.5 text-white/35 hover:text-[#bfa06f] transition-colors text-[0.65rem] sm:text-xs font-semibold"
              >
                <Share2 className="h-3 w-3" />
                {copied ? 'Copied!' : 'Share'}
              </button>
            </div>
          </div>
        </section>

        {/* ── Article Body ── */}
        <article
          className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-14"
          style={{ animation: 'fadeUp 0.6s ease 0.25s both' }}
        >
          {post.featuredImage && (
            <div className="w-full overflow-hidden rounded-xl sm:rounded-2xl border border-[#e8e0d0] mb-7 sm:mb-12 shadow-sm">
              <img
                src={post.featuredImage.src}
                alt={post.featuredImage.title || post.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {post.excerpt && (
            <p className="text-sm sm:text-lg text-[#4a4a4a] leading-relaxed border-l-2 border-[#bfa06f] pl-3 sm:pl-5 mb-7 sm:mb-12 italic">
              {post.excerpt}
            </p>
          )}

          <div
            className="
              prose prose-sm sm:prose-base max-w-none
              prose-headings:font-bold prose-headings:text-[#0d2340] prose-headings:leading-snug
              prose-h2:text-base sm:prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
              prose-h3:text-sm sm:prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
              prose-p:text-[#4a4a4a] prose-p:leading-relaxed prose-p:text-[0.82rem] sm:prose-p:text-base
              prose-a:text-[#bfa06f] prose-a:no-underline hover:prose-a:underline prose-a:font-medium
              prose-strong:text-[#0d2340]
              prose-ul:text-[#4a4a4a] prose-ol:text-[#4a4a4a]
              prose-li:text-[0.82rem] sm:prose-li:text-base prose-li:leading-relaxed
              prose-blockquote:border-l-2 prose-blockquote:border-[#bfa06f]
              prose-blockquote:text-[#6a6a6a] prose-blockquote:not-italic
              prose-blockquote:pl-3 sm:prose-blockquote:pl-5
              prose-img:rounded-xl prose-img:border prose-img:border-[#e8e0d0] prose-img:shadow-sm
              prose-hr:border-[#e8e0d0]
              prose-code:text-[#bfa06f] prose-code:bg-[#f9f7f1] prose-code:rounded prose-code:px-1.5 prose-code:py-0.5
            "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Footer Actions */}
          <div className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-[#e8e0d0] flex items-center justify-between gap-3 flex-wrap">
            <Link
              to="/blog"
              className="group inline-flex items-center gap-1.5 border border-[#e8e0d0] hover:border-[#bfa06f]/50 text-[#4a4a4a] hover:text-[#bfa06f] text-[0.7rem] sm:text-sm font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-200"
            >
              <ArrowLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5 group-hover:-translate-x-0.5 transition-transform" />
              All Posts
            </Link>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 bg-[#bfa06f] hover:bg-[#a08a5f] text-white text-[0.7rem] sm:text-sm font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-colors shadow-sm"
            >
              <Share2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              {copied ? 'Link Copied!' : 'Share Post'}
            </button>
          </div>
        </article>
      </div>
      <Footer />
    </>
  );
};

export default BlogPostDetailPage;
