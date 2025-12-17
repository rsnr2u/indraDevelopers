import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getData, setData, addItem, deleteItem } from '../../utils/localStorage';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner@2.0.3';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { InitializeSampleData } from '../../components/admin/InitializeSampleData';

export function Blog() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setCategories(getData('blogCategories') || []);
    setPosts(getData('blogPosts') || []);
  };

  const handleSaveCategory = () => {
    if (!formData.name) {
      toast.error('Please enter category name');
      return;
    }

    const slug = formData.name.toLowerCase().replace(/\s+/g, '-');
    
    if (editingItem) {
      const updated = categories.map(cat => 
        cat.id === editingItem.id ? { ...cat, name: formData.name, slug } : cat
      );
      setData('blogCategories', updated);
      toast.success('Category updated successfully!');
    } else {
      addItem('blogCategories', { name: formData.name, slug });
      toast.success('Category added successfully!');
    }

    loadData();
    setIsDialogOpen(false);
    setFormData({});
    setEditingItem(null);
  };

  const handleSavePost = () => {
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

    if (editingItem) {
      const updated = posts.map(post => 
        post.id === editingItem.id ? { ...post, ...postData } : post
      );
      setData('blogPosts', updated);
      toast.success('Post updated successfully!');
    } else {
      addItem('blogPosts', postData);
      toast.success('Post created successfully!');
    }

    loadData();
    setIsDialogOpen(false);
    setFormData({});
    setEditingItem(null);
  };

  const handleDelete = (id: string, type: 'blogCategories' | 'blogPosts') => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    deleteItem(type, id);
    loadData();
    toast.success('Item deleted successfully!');
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl mb-6">Blog Management</h1>

        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl">Blog Posts</h2>
                <Button onClick={() => navigate('/admin/blog/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Post
                </Button>
              </div>

              <InitializeSampleData />

              <div className="space-y-2">
                {posts.map((post) => (
                  <div key={post.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg">{post.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {categories.find(c => c.id === post.categoryId)?.name || 'Uncategorized'} • {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded inline-block mt-2 ${
                          post.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {post.status}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/blog/edit/${post.id}`)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(post.id, 'blogPosts')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl">Blog Categories</h2>
                <Button onClick={() => {
                  setEditingItem(null);
                  setFormData({});
                  setIsDialogOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>

              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p>{category.name}</p>
                      <p className="text-sm text-gray-500">{category.slug}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingItem(category);
                          setFormData(category);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(category.id, 'blogCategories')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog for Category Only */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Category' : 'Add Category'}
            </DialogTitle>
            <DialogDescription>
              Organize your blog posts with categories
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Category Name</Label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <Button onClick={handleSaveCategory} className="w-full">
              Save Category
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}