import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Calendar, User, Clock,
  Share2, BookOpen, Loader2, AlertCircle,
} from 'lucide-react';
import Footer from '../components/Footer';
import NewsLoader from '../components/NewsLoader';

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  feature_image?: string;
  published_at: string;
  html: string;
  reading_time?: number;
  authors?: Array<{ name: string; profile_image?: string; bio?: string }>;
  tags?: Array<{ name: string; slug: string }>;
}

const BlogPostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) { setError('No post ID provided'); setLoading(false); return; }
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams({
          key: '0843bfcc306e6a0363a715e082',
          include: 'tags,authors',
          formats: 'html',
        });
        const res = await fetch(
          `https://soklaw-blogs.ghost.io/ghost/api/v3/content/posts/slug/${postId}/?${params}`,
          { headers: { Accept: 'application/json' }, mode: 'cors' }
        );
        if (!res.ok) throw new Error(res.status === 404 ? 'Article not found' : `HTTP ${res.status}`);
        const data = await res.json();
        if (data.posts?.length > 0) {
          setPost(data.posts[0]);
          document.title = `${data.posts[0].title} — SOK Law Associates`;
          document.querySelector('meta[name="description"]')
            ?.setAttribute('content', data.posts[0].excerpt || 'Legal insights from SOK Law.');
        } else throw new Error('Post not found');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unable to load article. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
    return () => { document.title = 'SOK Law Associates'; };
  }, [postId]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleShare = async () => {
    if (navigator.share && post) {
      try { await navigator.share({ title: post.title, text: post.excerpt, url: window.location.href }); }
      catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-white flex items-center justify-center pt-20">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#bfa06f]/10">
              <Loader2 className="h-4 w-4 text-[#bfa06f] animate-spin" />
            </div>
            <p className="text-xs text-[#6a6a6a]">Loading article…</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  /* ── Error ── */
  if (error || !post) {
    return (
      <>
        <div className="min-h-screen bg-white flex items-center justify-center pt-20 px-4">
          <div className="text-center max-w-sm">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#bfa06f]/10 mx-auto mb-4">
              <BookOpen className="h-5 w-5 text-[#bfa06f]" />
            </div>
            <div className="w-4 h-0.5 bg-[#bfa06f] mx-auto mb-3" />
            <h1 className="text-base sm:text-xl font-bold text-[#0d2340] mb-2">Article Not Found</h1>
            <p className="text-xs sm:text-sm text-[#6a6a6a] mb-6 leading-relaxed">
              {error || "The article you're looking for doesn't exist or has been removed."}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 bg-[#bfa06f] hover:bg-[#a08a5f] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to News
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  /* ── Article ── */
  return (
    <>
      <div className="min-h-screen bg-white w-full overflow-x-hidden">

        {/* ── Dark header band ── */}
        <div className="bg-[#0d2340] pt-24 sm:pt-28 pb-8 sm:pb-12 relative overflow-hidden">
          <div
            className="hidden lg:block absolute right-0 top-0 bottom-0 w-[38%] opacity-[0.04]"
            style={{ backgroundImage: 'repeating-linear-gradient(-55deg, #bfa06f 0px, #bfa06f 1px, transparent 1px, transparent 28px)' }}
          />
          <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">

            {/* Back + breadcrumb */}
            <div className="flex items-center gap-1.5 mb-4 sm:mb-6">
              <button
                onClick={() => navigate(-1)}
                className="group inline-flex items-center gap-1 text-white/50 hover:text-white text-[0.6rem] sm:text-xs font-semibold transition-colors"
              >
                <ArrowLeft className="h-2.5 w-2.5 group-hover:-translate-x-0.5 transition-transform" />
                Back
              </button>
              <span className="text-white/20 text-[0.6rem]">/</span>
              <button
                onClick={() => navigate('/')}
                className="text-white/40 hover:text-white/70 text-[0.6rem] sm:text-xs transition-colors"
              >
                Home
              </button>
              <span className="text-white/20 text-[0.6rem]">/</span>
              <span className="text-white/40 text-[0.6rem] sm:text-xs truncate max-w-[120px] sm:max-w-xs">
                {post.title}
              </span>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3 sm:mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag.slug}
                    className="text-[0.55rem] sm:text-[0.65rem] font-semibold uppercase tracking-widest text-[#bfa06f] bg-[#bfa06f]/10 border border-[#bfa06f]/20 rounded-full px-2 py-0.5"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3 sm:mb-5">
              {post.title}
            </h1>

            {/* Meta strip */}
            <div className="flex items-center flex-wrap gap-2 sm:gap-4">
              {[
                { icon: Calendar, val: formatDate(post.published_at) },
                post.reading_time ? { icon: Clock, val: `${post.reading_time} min read` } : null,
                post.authors?.length ? { icon: User, val: post.authors[0].name } : null,
              ].filter(Boolean).map(({ icon: Icon, val }: any) => (
                <div key={val} className="flex items-center gap-1 sm:gap-1.5">
                  <Icon className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-[#bfa06f] flex-shrink-0" />
                  <span className="text-[0.6rem] sm:text-xs text-white/50">{val}</span>
                </div>
              ))}

              {/* Share */}
              <button
                onClick={handleShare}
                className="ml-auto flex items-center gap-1 text-white/40 hover:text-[#bfa06f] transition-colors text-[0.6rem] sm:text-xs font-semibold"
              >
                <Share2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                {copied ? 'Copied!' : 'Share'}
              </button>
            </div>
          </div>
        </div>

        {/* Feature image — bleeds below header */}
        {post.featuredImage && (
          <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8 -mt-0">
            <div className="w-full aspect-video sm:aspect-[21/9] overflow-hidden rounded-xl sm:rounded-2xl border border-[#e8e0d0] shadow-sm">
              <img
                src={post.featuredImage.src}
                alt={post.featuredImage.title || post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* ── Article body ── */}
        <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">

          {/* Excerpt lede */}
          {post.excerpt && (
            <p className="text-sm sm:text-lg text-[#4a4a4a] leading-relaxed border-l-2 border-[#bfa06f] pl-3 sm:pl-4 mb-6 sm:mb-10 italic">
              {post.excerpt}
            </p>
          )}

          {/* Ghost HTML content */}
          <div
            className="
              prose prose-sm sm:prose-base max-w-none
              prose-headings:font-bold prose-headings:text-[#0d2340] prose-headings:leading-snug
              prose-h2:text-lg sm:prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
              prose-h3:text-base sm:prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
              prose-p:text-[#4a4a4a] prose-p:leading-relaxed prose-p:text-[0.8rem] sm:prose-p:text-base
              prose-a:text-[#bfa06f] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-[#0d2340]
              prose-ul:text-[#4a4a4a] prose-ol:text-[#4a4a4a]
              prose-li:text-[0.8rem] sm:prose-li:text-base prose-li:leading-relaxed
              prose-blockquote:border-l-2 prose-blockquote:border-[#bfa06f] prose-blockquote:text-[#6a6a6a] prose-blockquote:not-italic prose-blockquote:pl-4
              prose-img:rounded-xl prose-img:border prose-img:border-[#e8e0d0]
              prose-hr:border-[#e8e0d0]
              prose-code:text-[#bfa06f] prose-code:bg-[#f9f7f1] prose-code:rounded prose-code:px-1
            "
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          {/* Footer actions ── */}
          <div className="mt-8 sm:mt-14 pt-5 sm:pt-8 border-t border-[#e8e0d0] flex items-center justify-between gap-3 flex-wrap">
            <button
              onClick={() => navigate(-1)}
              className="group inline-flex items-center gap-1.5 border border-[#e8e0d0] hover:border-[#bfa06f]/50 text-[#4a4a4a] hover:text-[#bfa06f] text-[0.65rem] sm:text-sm font-semibold px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-200"
            >
              <ArrowLeft className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Back to News
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 bg-[#bfa06f] hover:bg-[#a08a5f] text-white text-[0.65rem] sm:text-sm font-semibold px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full transition-colors"
            >
              <Share2 className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
              {copied ? 'Link Copied!' : 'Share Article'}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BlogPostPage;
