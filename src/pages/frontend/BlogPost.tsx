import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getData } from '../../utils/localStorage';
import { Header } from '../../components/frontend/Header';
import { Footer } from '../../components/frontend/Footer';
import { Calendar, User, ArrowLeft, Clock, Share2, Tag, ChevronRight, Facebook, Twitter, Linkedin, Link as LinkIcon, MessageCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const { colors } = useTheme();

  useEffect(() => {
    const loadData = async () => {
      const posts = await getData('blogPosts') || [];
      const foundPost = posts.find((p: any) => p.slug === slug);
      setPost(foundPost);

      if (foundPost) {
        const categories = await getData('blogCategories') || [];
        setCategory(categories.find((c: any) => c.id === foundPost.categoryId));

        // Get related posts
        const related = posts
          .filter((p: any) => p.categoryId === foundPost.categoryId && p.id !== foundPost.id && p.status === 'Published')
          .slice(0, 3);
        setRelatedPosts(related);
      }
    };
    loadData();
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl mb-4">Post not found</h2>
            <Link to="/blog" className="text-blue-600 hover:underline">
              ← Back to Blog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const readingTime = Math.ceil((post.content?.length || 0) / 1000);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <div className="flex-1">
        {/* Simple Header Section */}
        <div
          className="relative py-8 md:py-12"
          style={{ background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})` }}
        >
          <div className="absolute inset-0 bg-black/10" />

          {/* Hero Content */}
          <div className="relative container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>

              {category && (
                <div className="mb-3">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm text-white"
                  >
                    {category.name}
                  </span>
                </div>
              )}

              <h1 className="text-3xl md:text-4xl text-white mb-4 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.publishDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{readingTime} min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
            {/* Main Content */}
            <div className="lg:col-span-8">
              <article className="bg-white rounded-lg shadow-lg p-8 md:p-12">
                {/* Featured Image at Content Start */}
                {post.featuredImage && (
                  <div className="mb-8 -mx-8 md:-mx-12 -mt-8 md:-mt-12">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-[400px] object-cover rounded-t-lg"
                    />
                  </div>
                )}

                {/* Meta Description */}
                {post.metaDescription && (
                  <div className="mb-8 pb-8 border-b">
                    <p className="text-lg text-gray-700 leading-relaxed italic">
                      {post.metaDescription}
                    </p>
                  </div>
                )}

                {/* Post Content */}
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                  style={{
                    '--tw-prose-headings': colors.textColor,
                    '--tw-prose-links': colors.primaryColor,
                    '--tw-prose-bold': colors.textColor,
                  } as React.CSSProperties}
                />

                {/* Share Section */}
                <div className="mt-12 pt-8 border-t">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-gray-900 mb-4">
                      <Share2 className="h-5 w-5" style={{ color: colors.primaryColor }} />
                      <h3 className="text-lg font-medium">Share this article</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-6">Help others discover this content by sharing it on your favorite platform</p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {/* Facebook */}
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 bg-[#1877F2] text-white rounded-lg hover:bg-[#1666d9] transition-all shadow-md hover:shadow-lg"
                    >
                      <Facebook className="h-4 w-4" />
                      <span className="text-sm font-medium">Facebook</span>
                    </a>

                    {/* Twitter */}
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a8cd8] transition-all shadow-md hover:shadow-lg"
                    >
                      <Twitter className="h-4 w-4" />
                      <span className="text-sm font-medium">Twitter</span>
                    </a>

                    {/* LinkedIn */}
                    <a
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 bg-[#0A66C2] text-white rounded-lg hover:bg-[#095196] transition-all shadow-md hover:shadow-lg"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span className="text-sm font-medium">LinkedIn</span>
                    </a>

                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(post.title + ' - ' + window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 bg-[#25D366] text-white rounded-lg hover:bg-[#20bd5a] transition-all shadow-md hover:shadow-lg"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">WhatsApp</span>
                    </a>

                    {/* Copy Link */}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        const btn = document.getElementById('copy-link-btn');
                        if (btn) {
                          const originalText = btn.textContent;
                          btn.textContent = 'Copied!';
                          setTimeout(() => {
                            btn.textContent = originalText || 'Copy Link';
                          }, 2000);
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
                    >
                      <LinkIcon className="h-4 w-4" />
                      <span id="copy-link-btn" className="text-sm font-medium">Copy Link</span>
                    </button>
                  </div>
                </div>

                {/* Author Info Card */}
                <div className="mt-8 p-6 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div
                      className="h-16 w-16 rounded-full flex items-center justify-center text-white text-xl"
                      style={{ backgroundColor: colors.primaryColor }}
                    >
                      {post.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{post.author}</h3>
                      <p className="text-gray-600">Article Author</p>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                {/* Category Card */}
                {category && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Tag className="h-5 w-5" style={{ color: colors.primaryColor }} />
                      <h3 className="text-lg font-medium">Category</h3>
                    </div>
                    <Link
                      to="/blog"
                      className="inline-block px-4 py-2 rounded-lg transition-colors hover:shadow-md"
                      style={{
                        backgroundColor: `${colors.primaryColor}10`,
                        color: colors.primaryColor
                      }}
                    >
                      {category.name}
                    </Link>
                  </div>
                )}

                {/* Recent Posts */}
                {allPosts.length > 1 && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-medium mb-4">Recent Posts</h3>
                    <div className="space-y-4">
                      {allPosts
                        .filter(p => p.id !== post.id)
                        .slice(0, 5)
                        .map((recentPost) => (
                          <Link
                            key={recentPost.id}
                            to={`/blog/${recentPost.slug}`}
                            className="block group"
                          >
                            <h4 className="text-sm font-medium group-hover:underline transition-colors line-clamp-2"
                              style={{ color: colors.textColor }}
                            >
                              {recentPost.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(recentPost.publishDate).toLocaleDateString()}
                            </p>
                          </Link>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Posts Section */}
          {relatedPosts.length > 0 && (
            <div className="max-w-7xl mx-auto mt-16">
              <div className="mb-8">
                <h2 className="text-3xl mb-2" style={{ color: colors.textColor }}>
                  Related Articles
                </h2>
                <p className="text-gray-600">
                  More posts from {category?.name}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.slug}`}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all group"
                  >
                    {/* Image */}
                    {relatedPost.featuredImage ? (
                      <img
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div
                        className="w-full h-48 flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})` }}
                      >
                        <Tag className="h-12 w-12 text-white opacity-50" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(relatedPost.publishDate).toLocaleDateString()}
                        </span>
                      </div>

                      <h3
                        className="text-xl mb-3 line-clamp-2 group-hover:underline"
                        style={{ color: colors.textColor }}
                      >
                        {relatedPost.title}
                      </h3>

                      {relatedPost.metaDescription && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                          {relatedPost.metaDescription}
                        </p>
                      )}

                      <div
                        className="inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all"
                        style={{ color: colors.primaryColor }}
                      >
                        Read More
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Navigation to Previous/Next Post */}
          <div className="max-w-7xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {allPosts.findIndex(p => p.id === post.id) > 0 && (
              <button
                onClick={() => {
                  const prevPost = allPosts[allPosts.findIndex(p => p.id === post.id) - 1];
                  navigate(`/blog/${prevPost.slug}`);
                }}
                className="bg-white rounded-lg shadow-lg p-6 text-left hover:shadow-xl transition-all group"
              >
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous Article</span>
                </div>
                <h3
                  className="text-lg font-medium group-hover:underline"
                  style={{ color: colors.textColor }}
                >
                  {allPosts[allPosts.findIndex(p => p.id === post.id) - 1]?.title}
                </h3>
              </button>
            )}

            {allPosts.findIndex(p => p.id === post.id) < allPosts.length - 1 && (
              <button
                onClick={() => {
                  const nextPost = allPosts[allPosts.findIndex(p => p.id === post.id) + 1];
                  navigate(`/blog/${nextPost.slug}`);
                }}
                className="bg-white rounded-lg shadow-lg p-6 text-right hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-end gap-2 text-sm text-gray-500 mb-2">
                  <span>Next Article</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
                <h3
                  className="text-lg font-medium group-hover:underline"
                  style={{ color: colors.textColor }}
                >
                  {allPosts[allPosts.findIndex(p => p.id === post.id) + 1]?.title}
                </h3>
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}