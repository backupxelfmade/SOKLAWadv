import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';
import { getAllBlogPosts, BlogPost } from '../services/caisyApi';
import Footer from '../components/Footer';

const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllBlogPosts();
        setPosts(data);
      } catch (err) {
        setError('Failed to load blog posts. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleBackToNews = () => {
    navigate('/');
    setTimeout(() => {
      document.getElementById('news')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-white w-full overflow-x-hidden">
          <div className="bg-[#0d2340] pt-24 sm:pt-28 pb-8 sm:pb-12">
            <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 animate-pulse">
              <div className="h-2.5 bg-white/10 rounded-full w-16 mb-5" />
              <div className="h-5 bg-white/10 rounded-full w-28 mb-3" />
              <div className="h-8 bg-white/10 rounded-full w-48 mb-3" />
              <div className="h-3 bg-white/10 rounded-full w-64" />
            </div>
          </div>
          <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-[#e8e0d0] overflow-hidden animate-pulse">
                  <div className="w-full h-44 sm:h-52 bg-[#f0ece3]" />
                  <div className="p-4 sm:p-6 space-y-3">
                    <div className="h-3 bg-[#f0ece3] rounded-full w-3/4" />
                    <div className="h-3 bg-[#f0ece3] rounded-full w-full" />
                    <div className="h-3 bg-[#f0ece3] rounded-full w-5/6" />
                    <div className="h-3 bg-[#f0ece3] rounded-full w-1/2 mt-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <>
        <div className="min-h-screen bg-white w-full overflow-x-hidden">
          <div className="bg-[#0d2340] pt-24 sm:pt-28 pb-8 sm:pb-12 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="block h-px w-5 sm:w-8 bg-[#bfa06f]" />
                <span className="text-[0.6rem] sm:text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#bfa06f]">
                  Insights
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Insights</h1>
            </div>
          </div>
          <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-10 sm:py-16 flex items-center justify-center">
            <div className="text-center max-w-sm">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#bfa06f]/10 mx-auto mb-4">
                <BookOpen className="h-5 w-5 text-[#bfa06f]" />
              </div>
              <div className="w-4 h-0.5 bg-[#bfa06f] mx-auto mb-3" />
              <p className="text-xs sm:text-sm text-[#6a6a6a] leading-relaxed mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-1.5 bg-[#bfa06f] hover:bg-[#a08a5f] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  /* ── Main ── */
  return (
    <>
      <div className="min-h-screen bg-white w-full overflow-x-hidden">

        {/* ── Dark header band ── */}
        <div className="bg-[#0d2340] pt-24 sm:pt-28 pb-8 sm:pb-12 relative overflow-hidden">
          <div
            className="hidden lg:block absolute right-0 top-0 bottom-0 w-[38%] opacity-[0.04]"
            style={{ backgroundImage: 'repeating-linear-gradient(-55deg, #bfa06f 0px, #bfa06f 1px, transparent 1px, transparent 28px)' }}
          />
          <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
            <button
              onClick={handleBackToNews}
              className="group inline-flex items-center gap-1 text-white/50 hover:text-white text-[0.6rem] sm:text-xs font-semibold transition-colors mb-4 sm:mb-6"
            >
              <ArrowLeft className="h-2.5 w-2.5 group-hover:-translate-x-0.5 transition-transform" />
              Back to News
            </button>
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className="block h-px w-5 sm:w-8 bg-[#bfa06f] flex-shrink-0" />
              <span className="text-[0.6rem] sm:text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#bfa06f]">
                Insights
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
              Blog
            </h1>
            <p className="text-[0.7rem] sm:text-sm text-white/50 max-w-md">
              Insights, updates, and expertise from our team
            </p>
          </div>
        </div>

        {/* ── Post grid ── */}
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
          {posts.length === 0 ? (
            <div className="text-center py-16 sm:py-24">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#bfa06f]/10 mx-auto mb-4">
                <BookOpen className="h-5 w-5 text-[#bfa06f]" />
              </div>
              <div className="w-4 h-0.5 bg-[#bfa06f] mx-auto mb-3" />
              <p className="text-xs sm:text-sm text-[#6a6a6a]">No posts available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group flex flex-col bg-white rounded-xl border border-[#e8e0d0] hover:border-[#bfa06f]/40 hover:shadow-[0_4px_24px_rgba(191,160,111,0.12)] transition-all duration-300 overflow-hidden"
                >
                  {post.featuredImage ? (
                    <div className="relative h-40 sm:h-48 overflow-hidden flex-shrink-0">
                      <img
                        src={post.featuredImage.src}
                        alt={post.featuredImage.title || post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d2340]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ) : (
                    <div className="h-40 sm:h-48 bg-[#f0ece3] flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-8 w-8 text-[#bfa06f]/40" />
                    </div>
                  )}
                  <div className="flex flex-col flex-1 p-4 sm:p-5">
                    <h2 className="text-sm sm:text-base font-bold text-[#0d2340] mb-2 line-clamp-2 leading-snug group-hover:text-[#bfa06f] transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-[0.65rem] sm:text-xs text-[#6a6a6a] leading-relaxed line-clamp-3 mb-3 flex-1">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-3 pt-3 border-t border-[#e8e0d0] mt-auto">
                      {post.publishedDate && (
                        <div className="flex items-center gap-1 min-w-0">
                          <Calendar className="h-2.5 w-2.5 text-[#bfa06f] flex-shrink-0" />
                          <span className="text-[0.55rem] sm:text-[0.65rem] text-[#6a6a6a] truncate">
                            {formatDate(post.publishedDate)}
                          </span>
                        </div>
                      )}
                      {post.author && (
                        <div className="flex items-center gap-1 min-w-0">
                          <User className="h-2.5 w-2.5 text-[#bfa06f] flex-shrink-0" />
                          <span className="text-[0.55rem] sm:text-[0.65rem] text-[#6a6a6a] truncate">
                            {post.author}
                          </span>
                        </div>
                      )}
                      <div className="ml-auto flex items-center gap-0.5 text-[#bfa06f] flex-shrink-0">
                        <span className="text-[0.55rem] sm:text-[0.65rem] font-semibold">Read</span>
                        <ArrowRight className="h-2.5 w-2.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogPage;
