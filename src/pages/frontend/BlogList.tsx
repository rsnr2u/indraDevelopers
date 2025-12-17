import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getData } from '../../utils/localStorage';
import { Header } from '../../components/frontend/Header';
import { Footer } from '../../components/frontend/Footer';
import { Calendar, User, FileText } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function BlogList() {
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { colors } = useTheme();

  useEffect(() => {
    const loadData = async () => {
      const allPosts = await getData('blogPosts') || [];
      setPosts(allPosts.filter((post: any) => post.status === 'Published'));
      const categoriesData = await getData('blogCategories') || [];
      setCategories(categoriesData);
    };
    loadData();
  }, []);

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(post => post.categoryId === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1">
        {/* Page Header */}
        <div
          className="text-white py-16"
          style={{ background: `linear-gradient(to right, ${colors.primaryColor}, ${colors.secondaryColor})` }}
        >
          <div className="container mx-auto px-4">
            <h1 className="text-4xl mb-4">Blog</h1>
            <p className="text-xl">Latest news and updates</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-lg sticky top-24">
                <h3
                  className="text-xl mb-4"
                  style={{ color: colors.textColor }}
                >
                  Categories
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-4 py-2 rounded transition-colors ${selectedCategory === 'all'
                        ? 'text-white'
                        : 'hover:bg-gray-100'
                      }`}
                    style={selectedCategory === 'all' ? { backgroundColor: colors.primaryColor } : {}}
                  >
                    All Posts
                  </button>
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-2 rounded transition-colors ${selectedCategory === category.id
                          ? 'text-white'
                          : 'hover:bg-gray-100'
                        }`}
                      style={selectedCategory === category.id ? { backgroundColor: colors.primaryColor } : {}}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="lg:col-span-3">
              {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredPosts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all group"
                      style={{
                        '--hover-border-color': colors.accentColor
                      } as React.CSSProperties}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = colors.accentColor;
                        e.currentTarget.style.borderWidth = '2px';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.borderWidth = '0px';
                      }}
                    >
                      {post.featuredImage ? (
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-48 flex items-center justify-center"
                          style={{ background: `linear-gradient(to bottom right, ${colors.primaryColor}, ${colors.secondaryColor})` }}
                        >
                          <FileText className="h-16 w-16 text-white opacity-50" />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{post.author}</span>
                          </div>
                        </div>
                        <h3
                          className="text-xl mb-2"
                          style={{ color: colors.textColor }}
                        >
                          {post.title}
                        </h3>
                        {post.metaDescription && (
                          <p className="text-gray-600 text-sm line-clamp-3">
                            {post.metaDescription}
                          </p>
                        )}
                        <div className="mt-4">
                          <span
                            className="hover:underline transition-colors"
                            style={{ color: colors.primaryColor }}
                          >
                            Read More →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No blog posts found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}