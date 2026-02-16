
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import PublicHeader from '../../components/PublicHeader';
import Footer from '../../components/Footer';
import { SEO } from '../../components/SEO';
import { blogPosts, BlogPost } from '../../data/BlogPosts';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = blogPosts.find(p => p.slug === slug);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <button onClick={() => navigate('/blog')} className="text-blue-600 hover:underline">Return to Blog</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={post.title}
        description={post.excerpt}
        image={post.imageUrl}

        type="article"
      />
      <PublicHeader />

      <main className="pt-32 pb-20">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 font-medium mb-8 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Blog
          </button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-6">
              {post.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  <User size={16} />
                </div>
                <span className="font-medium text-gray-900">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{post.date}</span>
              </div>
            </div>
          </motion.div>

          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl overflow-hidden shadow-xl mb-12 aspect-video"
          >
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
          </motion.div>

          {/* Content */}
          <div className="max-w-3xl mx-auto">
            <div
              className="prose prose-lg prose-blue mx-auto text-gray-700"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Share */}
            <div className="border-t border-gray-100 mt-16 pt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Share2 size={20} /> Share this article
              </h3>
              <div className="flex gap-4">
                <button className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                  <Twitter size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-blue-800 text-white flex items-center justify-center hover:bg-blue-900 transition-all">
                  <Facebook size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition-all">
                  <Linkedin size={18} />
                </button>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPostPage;
