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
        const data = await getAllBlogPosts(); // Now loads /data/blog-posts.json instantly
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

  // ... rest of component EXACTLY THE SAME (formatDate, handleBackToNews, JSX unchanged)
  
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleBackToNews = () => {
    navigate('/');
    setTimeout(() => {
      document.getElementById('news')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Loading, Error, Main JSX blocks unchanged - copy from your original
  if (loading) { /* your skeleton JSX */ }
  if (error) { /* your error JSX */ }

  return (
    // Your full JSX unchanged
  );
};

export default BlogPage;
