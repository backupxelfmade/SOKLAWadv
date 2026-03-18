import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import NewsLoader from './NewsLoader';
import { getAllBlogPosts, BlogPost } from '../services/caisyApi';

const News = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.news-card').forEach((card, i) => {
              setTimeout(() => card.classList.add('animate-fade-in-up'), i * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getAllBlogPosts(); // ✅ Reads /data/blog-posts.json instantly
        setPosts(data.slice(0, 6));
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Unable to load blog posts at the moment. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleArticleClick = (post: BlogPost) => navigate(`/blog/${post.slug}`);

  const handleViewAllClick = () => {
    navigate('/blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });

  return (
    <section ref={sectionRef} id="news" className="py-10 sm:py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-10">

        {/* ── Section header ── */}
        <div className="mb-6 sm:mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className="block h-px w-5 sm:w-6 bg-[#bfa06f]" />
              <span className="text-[0.6rem] sm:text-[0.7rem] font-semibold uppercase tracking-widest text-[#bfa06f]">
                Insights & Updates
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] leading-tight">
              Latest Insights
            </h2>
          </div>
          {!isLoading && !error && posts.length > 0 && (
            <button
              onClick={handleViewAllClick}
              className="hidden sm:flex items-center gap-2 self-end text-sm font-semibold text-[#bfa06f] hover:text-[#a08a5f] transition-colors duration-200 group pb-1 border-b border-[#bfa06f]/40 hover:border-[#a08a5f] whitespace-nowrap"
            >
              <span>View All Posts</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        {/* Subheading — desktop only */}
        <p className="hidden sm:block text-base text-[#4a4a4a] max-w-2xl mb-10 leading-relaxed">
          Stay updated with our latest legal insights, case victories, and important
          legal developments affecting individuals and businesses in Kenya.
        </p>

        {/* ── Loading ── */}
        {isLoading && <NewsLoader message="Loading latest blog posts..." variant="cards" />}

        {/* ── Error ── */}
        {error && !isLoading && (
          <div className="py-8 flex justify-center">
            <div className="bg-[#f9f7f1] border border-[#e8e0d0] rounded-2xl p-5 max-w-sm w-full text-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 mx-auto mb-3">
                <AlertCircle className="h-4 w-4 text-red-500" />
              </div>
              <h3 className="text-sm font-bold text-[#1a1a1a] mb-1">Unable to Load Insights</h3>
              <p className="text-xs text-[#6a6a6a] mb-4 leading-relaxed">{error}</p>
              <button
                onClick={() => { setError(null); window.location.reload(); }}
                className="flex items-center justify-center gap-2 bg-[#bfa06f] hover:bg-[#a08a5f] text-white text-xs font-semibold px-5 py-2 rounded-full transition-colors duration-200 mx-auto"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        )}

        {/* ── Empty ── */}
        {!isLoading && !error && posts.length === 0 && (
          <div className="py-8 flex justify-center">
            <div className="bg-[#f9f7f1] border border-[#e8e0d0] rounded-2xl p-5 max-w-sm w-full text-center">
              <h3 className="text-sm font-bold text-[#1a1a1a] mb-1">No Posts Yet</h3>
              <p className="text-xs text-[#6a6a6a]">Check back later for new content.</p>
            </div>
          </div>
        )}

        {/* ── Posts ── */}
        {!isLoading && !error && posts.length > 0 && (
          <>
            {/* Mobile — stacked list rows */}
            <div className="flex flex-col divide-y divide-[#e8e0d0] sm:hidden">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="news-card opacity-0 flex items-start gap-3 py-3 cursor-pointer group"
                  onClick={() => handleArticleClick(post)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleArticleClick(post); }
                  }}
                  aria-label={`Read article: ${post.title}`}
                >
                  {post.featuredImage ? (
                    <div className="w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-[#e8e0d0]">
                      <img
                        src={post.featuredImage.src}
                        alt={post.featuredImage.title || post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-16 flex-shrink-0 rounded-lg bg-[#bfa06f]/10 flex items-center justify-center">
                      <span className="text-[#bfa06f] text-lg font-black">{post.title.charAt(0)}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="w-3 h-0.5 bg-[#bfa06f] mb-1" />
                    <h3 className="text-xs font-bold text-[#1a1a1a] leading-snug line-clamp-2 group-hover:text-[#bfa06f] transition-colors duration-200 mb-1">
                      {post.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      {post.publishedDate && (
                        <div className="flex items-center gap-1 text-[#6a6a6a]">
                          <Calendar className="h-2.5 w-2.5" />
                          <span className="text-[0.6rem]">{formatDate(post.publishedDate)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-0.5 text-[#bfa06f] text-[0.6rem] font-semibold">
                        <span>Read</span>
                        <ArrowRight className="h-2.5 w-2.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Desktop — card grid */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="news-card opacity-0 group bg-white border border-[#e8e0d0] hover:border-[#bfa06f]/40 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                  onClick={() => handleArticleClick(post)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleArticleClick(post); }
                  }}
                  aria-label={`Read article: ${post.title}`}
                >
                  {post.featuredImage && (
                    <div className="aspect-video overflow-hidden bg-[#e8e0d0]">
                      <img
                        src={post.featuredImage.src}
                        alt={post.featuredImage.title || post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="w-5 h-0.5 bg-[#bfa06f] mb-3 transition-all duration-300 group-hover:w-8" />
                    <h3 className="font-bold text-[#1a1a1a] leading-snug line-clamp-2 mb-2 text-base lg:text-lg group-hover:text-[#bfa06f] transition-colors duration-200">
                      {post.title}
                    </h3>
                    <p className="text-[#6a6a6a] text-sm leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        {post.publishedDate && (
                          <div className="flex items-center gap-1 text-[#6a6a6a]">
                            <Calendar className="h-3 w-3 flex-shrink-0" />
                            <span className="text-xs truncate">{formatDate(post.publishedDate)}</span>
                          </div>
                        )}
                        {post.author && (
                          <div className="flex items-center gap-1 text-[#6a6a6a]">
                            <User className="h-3 w-3 flex-shrink-0" />
                            <span className="text-xs truncate">{post.author}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[#bfa06f] text-xs font-semibold flex-shrink-0 group-hover:gap-1.5 transition-all duration-200">
                        <span>Read more</span>
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Mobile "View All" */}
            <div className="mt-5 flex justify-center sm:hidden">
              <button
                onClick={handleViewAllClick}
                className="flex items-center justify-center gap-2 bg-[#bfa06f] hover:bg-[#a08a5f] text-white font-semibold text-sm px-6 py-2.5 rounded-full shadow-md transition-all duration-200 w-full max-w-xs"
              >
                <span>View All Posts</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </section>
  );
};

export default News;
