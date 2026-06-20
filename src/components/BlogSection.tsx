import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Calendar, User, MessageSquare, Send, ChevronRight, Hash, ArrowLeft, Clock } from 'lucide-react';
import { BLOG_POSTS, type Comment, type BlogPost } from '../data/blogPosts';

interface BlogSectionProps {
  currentUser: { name?: string; email?: string } | null;
  authToken: string | null;
}

export default function BlogSection({ currentUser, authToken }: BlogSectionProps) {
  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  // Comment Form state
  const [comName, setComName] = useState<string>(currentUser?.name || '');
  const [comEmail, setComEmail] = useState<string>(currentUser?.email || '');
  const [comContent, setComContent] = useState<string>('');
  const [submittingComment, setSubmittingComment] = useState<boolean>(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [commentSuccess, setCommentSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      setComName(currentUser.name || '');
      setComEmail(currentUser.email || '');
    }
  }, [currentUser]);

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    setCommentSuccess(false);
    setCommentError(null);
    setComContent('');
    // Scroll to top of detailed view
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost) return;
    if (!comName.trim() || !comContent.trim()) {
      setCommentError('Name and comment message cannot be empty.');
      return;
    }

    setSubmittingComment(true);
    setCommentError(null);
    
    // Create new comment
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      userName: comName.trim(),
      userEmail: comEmail.trim(),
      content: comContent.trim(),
      createdAt: new Date().toISOString()
    };

    // Update selected post with new comment
    const updatedPost = {
      ...selectedPost,
      comments: [...(selectedPost.comments || []), newComment]
    };

    setSelectedPost(updatedPost);
    
    // Update posts list as well
    setPosts(prev => prev.map(p => p.id === selectedPost.id ? updatedPost : p));
    
    setComContent('');
    setCommentSuccess(true);
    setSubmittingComment(false);
    setTimeout(() => setCommentSuccess(false), 4000);
  };

  const getCategories = () => {
    const categories = new Set(posts.map(p => p.category));
    return ['All', ...Array.from(categories)];
  };

  const filteredPosts = activeCategory === 'All' 
    ? posts 
    : posts.filter(p => p.category === activeCategory);

  // Parse custom rich markdown-like strings elegantly to safe JSX elements
  const parseBodyContent = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const cleanLine = line.trim();
      if (!cleanLine) return <div key={idx} className="h-4" />;
      
      if (cleanLine.startsWith('###')) {
        return (
          <h4 key={idx} className="text-lg font-serif font-black text-brand-brown dark:text-brand-gold mt-6 mb-2">
            {cleanLine.replace('###', '').trim()}
          </h4>
        );
      }
      
      if (cleanLine.startsWith('##')) {
        return (
          <h3 key={idx} className="text-xl font-serif font-black text-brand-brown dark:text-brand-gold mt-8 mb-3">
            {cleanLine.replace('##', '').trim()}
          </h3>
        );
      }

      if (cleanLine.startsWith('-') || cleanLine.startsWith('*')) {
        return (
          <li key={idx} className="ml-5 list-disc text-xs sm:text-sm text-brand-brown/80 dark:text-stone-300 leading-relaxed mb-1 pl-1">
            {cleanLine.substring(1).trim()}
          </li>
        );
      }

      return (
        <p key={idx} className="text-xs sm:text-sm text-brand-brown/80 dark:text-stone-300 leading-relaxed mb-4 text-justify">
          {cleanLine}
        </p>
      );
    });
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans" id="sweet-delights-blog-section">
      
      {/* Blog Hero Banner */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#FAF7F2] bg-brand-gold px-3.5 py-1 rounded-full inline-block">
          Varshini's Masterclass Journal
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-brand-brown dark:text-brand-cream mt-3 italic">
          Gourmet Chronicles
        </h1>
        <p className="text-xs text-brand-brown/60 dark:text-stone-400 leading-relaxed mt-2.5">
          Step deeper into the art of elite confectionery. Explore insider secrets, baking masterclasses, and stories behind our flagship Sweet Delights creations.
        </p>
      </div>

      {selectedPost ? (
        
        /* DETAILED ARTICLE SCREEN */
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <button 
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-brand-brown/60 hover:text-brand-brown dark:text-stone-400 dark:hover:text-[#FAF7F2] mb-6 transition-colors cursor-pointer uppercase tracking-wider font-mono"
          >
            <ArrowLeft className="w-4 h-4" /> Back to all articles
          </button>

          {/* Article Header and main cover */}
          <div className="bg-white/80 dark:bg-stone-900/80 border border-brand-brown/10 rounded-2xl overflow-hidden shadow-sm p-4 sm:p-6 mb-8">
            <div className="relative h-60 sm:h-96 rounded-xl overflow-hidden mb-6">
              <img 
                src={selectedPost.image} 
                alt={selectedPost.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-brand-brown text-white dark:bg-brand-gold dark:text-brand-brown text-[10px] font-mono font-bold tracking-wider px-3 py-1 rounded-full uppercase shadow">
                {selectedPost.category}
              </div>
            </div>

            {/* Title and metadata */}
            <div className="border-b border-brand-brown/10 pb-4 mb-6">
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-brand-brown dark:text-brand-cream">
                {selectedPost.title}
              </h2>
              
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-brand-brown/60 dark:text-stone-400 font-mono mt-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {formatDate(selectedPost.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> By Chef Varshini
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" /> {(selectedPost.comments || []).length} Comments
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> 5 Min Read
                </span>
              </div>
            </div>

            {/* Rich text body text */}
            <div className="prose dark:prose-invert max-w-none">
              {parseBodyContent(selectedPost.content)}
            </div>
          </div>

          {/* Comments section */}
          <div className="bg-white/80 dark:bg-stone-900/80 border border-brand-brown/10 rounded-2xl p-6 shadow-sm space-y-6 mb-8">
            <h3 className="text-lg font-serif font-black text-brand-brown dark:text-brand-cream border-b border-brand-brown/10 pb-3 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-gold" /> Readers Comments ({(selectedPost.comments || []).length})
            </h3>

            {/* Comments list */}
            {(selectedPost.comments || []).length === 0 ? (
              <p className="text-xs text-brand-brown/50 dark:text-stone-400 italic text-center py-4">
                No comments shared yet. Be the first to share your thoughts below!
              </p>
            ) : (
              <div className="space-y-4 divide-y divide-brand-brown/5">
                {(selectedPost.comments || []).map((comment, index) => (
                  <div key={comment.id} className={`pt-4 ${index === 0 ? 'pt-0' : ''}`}>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-bold text-xs text-brand-brown dark:text-brand-gold">{comment.userName}</span>
                      <span className="text-[10px] text-brand-brown/55 dark:text-stone-400 font-mono">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-brand-brown/85 dark:text-stone-300 leading-relaxed font-sans mt-1 bg-[#FAF7F2]/40 dark:bg-black/10 p-3 rounded-lg border border-brand-brown/[0.03]">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Add comment Form */}
            <form onSubmit={handleCommentSubmit} className="border-t border-brand-brown/10 pt-5 space-y-4">
              <h4 className="text-xs font-mono font-bold tracking-wider text-brand-brown dark:text-brand-gold uppercase">
                Write a comment
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-brand-brown/60 dark:text-stone-300 font-mono uppercase mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={comName}
                    onChange={(e) => setComName(e.target.value)}
                    className="w-full border border-brand-brown/10 dark:border-stone-800 p-2.5 rounded-lg bg-[#FAF7F2]/30 dark:bg-stone-950 dark:text-stone-250 text-xs focus:outline-none focus:border-brand-gold"
                    placeholder="e.g. Baker Sienna"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-brand-brown/60 dark:text-stone-300 font-mono uppercase mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={comEmail}
                    onChange={(e) => setComEmail(e.target.value)}
                    className="w-full border border-brand-brown/10 dark:border-stone-800 p-2.5 rounded-lg bg-[#FAF7F2]/30 dark:bg-stone-950 dark:text-stone-250 text-xs focus:outline-none focus:border-brand-gold"
                    placeholder="client@bakingfan.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-brand-brown/60 dark:text-stone-300 font-mono uppercase mb-1">
                  Your Comment Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={comContent}
                  onChange={(e) => setComContent(e.target.value)}
                  className="w-full border border-brand-brown/10 dark:border-stone-800 p-2.5 rounded-lg bg-[#FAF7F2]/30 dark:bg-stone-950 dark:text-stone-250 text-xs focus:outline-none focus:border-brand-gold font-sans"
                  placeholder="Share your thoughts or questions about this baking article..."
                />
              </div>

              {commentError && (
                <p className="text-xs text-rose-600 bg-rose-500/5 px-3 py-2 rounded-lg border border-rose-500/10">
                  {commentError}
                </p>
              )}

              {commentSuccess && (
                <p className="text-xs text-emerald-600 bg-emerald-500/5 px-3 py-2 rounded-lg border border-emerald-500/10 font-bold">
                  ✓ Comment submitted successfully! It is now live in the section.
                </p>
              )}

              <button
                type="submit"
                disabled={submittingComment}
                className="w-full sm:w-auto py-2.5 px-6 rounded-full bg-brand-brown text-white dark:bg-brand-gold dark:text-brand-brown text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm hover:scale-102 transition-all cursor-pointer"
              >
                {submittingComment ? 'Sending...' : 'Publish Comment'} <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>
      ) : (
        
        /* OVERVIEW GRID */
        <div>
          {/* Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {getCategories().map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`py-1.5 px-4 rounded-full text-xs font-mono font-bold tracking-wider transition-all cursor-pointer border ${
                  activeCategory === cat
                    ? 'bg-brand-brown text-white border-brand-brown dark:bg-brand-gold dark:text-brand-brown dark:border-brand-gold shadow'
                    : 'bg-white/40 border-brand-brown/10 text-brand-brown hover:bg-brand-brown/5 dark:bg-stone-900/40 dark:text-stone-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid Layout of blogs */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20 bg-white/40 dark:bg-stone-900/30 rounded-2xl border border-brand-brown/5">
              <BookOpen className="w-10 h-10 text-brand-gold/60 mx-auto mb-3" />
              <p className="text-xs text-brand-brown/60 dark:text-stone-400 font-mono">No chronicles found under this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {filteredPosts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="bg-white/80 dark:bg-stone-900/80 border border-brand-brown/10 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group h-full"
                >
                  {/* Card photo wrapper */}
                  <div className="relative h-48 sm:h-56 overflow-hidden cursor-pointer" onClick={() => handlePostClick(post)}>
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-brand-brown/90 text-white dark:bg-brand-gold/90 dark:text-brand-brown text-[9px] font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full uppercase">
                      {post.category}
                    </div>
                  </div>

                  {/* Card details body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-[10px] text-brand-brown/50 dark:text-stone-400 font-mono">
                        <span className="flex items-center gap-0.5"><Calendar className="w-3 h-3" /> {formatDate(post.createdAt)}</span>
                        <span className="flex items-center gap-0.5"><MessageSquare className="w-3 h-3" /> {(post.comments || []).length} comments</span>
                      </div>
                      
                      <h3 
                        onClick={() => handlePostClick(post)}
                        className="text-lg font-serif font-black text-brand-brown dark:text-brand-cream leading-snug group-hover:text-brand-gold transition-colors cursor-pointer"
                      >
                        {post.title}
                      </h3>
                      
                      <p className="text-xs text-brand-brown/70 dark:text-stone-300 leading-relaxed line-clamp-3">
                        {post.content.replace(/[#*_-]/g, '').slice(0, 150)}...
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-brand-brown/5 flex items-center justify-between">
                      <span className="text-[10px] text-brand-brown/50 dark:text-stone-400 font-mono">
                        By Chef Varshini • 5 min read
                      </span>
                      
                      <button 
                        onClick={() => handlePostClick(post)}
                        className="text-xs font-bold text-brand-brown group-hover:text-brand-gold dark:text-brand-gold dark:group-hover:text-white flex items-center gap-0.5 cursor-pointer"
                      >
                        Read Post <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
