import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getData, setData, addItem } from '../../utils/localStorage';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner@2.0.3';
import { ImageUpload } from '../../components/ImageUpload';
import { RichTextEditor } from '../../components/RichTextEditor';
import { ArrowLeft, Save } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Textarea } from '../../components/ui/textarea';

export function BlogPostForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({
    title: '',
    categoryId: '',
    content: '',
    metaDescription: '',
    featuredImage: '',
    status: 'Draft',
    author: 'Indra Developers Team',
    publishDate: new Date().toISOString()
  });

  useEffect(() => {
    setCategories(getData('blogCategories') || []);

    if (id) {
      const posts = getData('blogPosts') || [];
      const post = posts.find((p: any) => p.id === id);
      if (post) {
        setFormData(post);
      }
    }
  }, [id]);

  const handleSave = () => {
    if (!formData.title || !formData.categoryId || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    const slug = formData.title.toLowerCase().replace(/\s+/g, '-');
    const postData = {
      ...formData,
      slug,
      status: formData.status || 'Draft',
      publishDate: formData.status === 'Published' ? new Date().toISOString() : formData.publishDate,
      author: formData.author || 'Indra Developers Team'
    };

    try {
      if (id) {
        const posts = getData('blogPosts') || [];
        const updated = posts.map((post: any) => 
          post.id === id ? { ...post, ...postData } : post
        );
        setData('blogPosts', updated);
        toast.success('Post updated successfully!');
      } else {
        addItem('blogPosts', postData);
        toast.success('Post created successfully!');
      }

      navigate('/admin/blog');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save post.');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/blog')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
          <h1 className="text-3xl">
            {id ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>
        </div>

        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Post Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter post title"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Author name"
              />
            </div>

            <div>
              <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
              <Textarea
                id="metaDescription"
                value={formData.metaDescription || ''}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                placeholder="Brief description for search engines and previews"
                rows={3}
              />
            </div>

            <ImageUpload
              label="Featured Image"
              value={formData.featuredImage || ''}
              onChange={(value) => setFormData({ ...formData, featuredImage: value })}
            />

            <div>
              <Label>Post Content *</Label>
              <RichTextEditor
                value={formData.content || ''}
                onChange={(value) => setFormData({ ...formData, content: value })}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save Post
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/admin/blog')}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
