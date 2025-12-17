import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { getData, addItem, updateItem, deleteItem } from '../../utils/localStorage';
import { toast } from 'sonner@2.0.3';
import { Plus, Edit, Trash2, FileText, Eye } from 'lucide-react';
import { RichTextEditor } from '../../components/RichTextEditor';
import { ImageUpload } from '../../components/ImageUpload';

interface Page {
  id: string;
  pageName: string;
  pageTitle: string;
  slug: string;
  description: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    ogImage: string;
  };
  status: 'Published' | 'Draft';
  createdAt: string;
  updatedAt: string;
}

export function Pages() {
  const navigate = useNavigate();
  const [pages, setPages] = useState<Page[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Page>>({
    pageName: '',
    pageTitle: '',
    slug: '',
    description: '',
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: '',
      ogImage: ''
    },
    status: 'Draft'
  });

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = () => {
    setPages(getData('customPages') || []);
  };

  const generateSlug = (pageName: string) => {
    return pageName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSave = () => {
    if (!formData.pageName || !formData.pageTitle) {
      toast.error('Please fill in required fields (Page Name & Title)');
      return;
    }

    // Generate slug from page name if not provided
    const slug = formData.slug || generateSlug(formData.pageName);

    const pageData = {
      ...formData,
      slug,
      updatedAt: new Date().toISOString(),
      createdAt: formData.createdAt || new Date().toISOString()
    };

    if (editingId) {
      updateItem('customPages', editingId, pageData);
      toast.success('Page updated successfully!');
    } else {
      addItem('customPages', pageData);
      toast.success('Page created successfully!');
    }

    resetForm();
    loadPages();
  };

  const handleEdit = (page: Page) => {
    setFormData(page);
    setEditingId(page.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this page?')) {
      deleteItem('customPages', id);
      toast.success('Page deleted successfully!');
      loadPages();
    }
  };

  const resetForm = () => {
    setFormData({
      pageName: '',
      pageTitle: '',
      slug: '',
      description: '',
      seo: {
        metaTitle: '',
        metaDescription: '',
        keywords: '',
        ogImage: ''
      },
      status: 'Draft'
    });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2">Pages Management</h1>
            <p className="text-slate-600">Create and manage custom pages for your website</p>
          </div>
          <Button onClick={() => navigate('/admin/pages/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Page
          </Button>
        </div>

        {/* Pages List */}
        <div className="grid grid-cols-1 gap-4">
          {pages.map((page) => (
            <Card key={page.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h3 className="text-xl">{page.pageTitle}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      page.status === 'Published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {page.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-2">{page.pageName}</p>
                  
                  <div className="text-sm text-slate-500">
                    <span>Slug: /{page.slug}</span>
                  </div>
                  
                  {page.description && (
                    <div 
                      className="mt-3 text-sm text-slate-700 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: page.description.substring(0, 200) + '...' }}
                    />
                  )}

                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                    {page.seo.metaTitle && (
                      <span className="px-2 py-1 bg-slate-100 rounded">
                        SEO Optimized
                      </span>
                    )}
                    <span className="px-2 py-1 bg-slate-100 rounded">
                      Updated: {new Date(page.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/admin/pages/edit/${page.id}`)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(page.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {pages.length === 0 && (
          <Card className="p-12 text-center">
            <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl mb-2">No custom pages yet</h3>
            <p className="text-slate-600 mb-6">
              Create your first custom page to extend your website
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Page
            </Button>
          </Card>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Edit Page' : 'Create New Page'}
              </DialogTitle>
              <DialogDescription>
                {editingId ? 'Update page details and SEO settings' : 'Create a new custom page with SEO optimization'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg border-b pb-2">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pageName">Page Name *</Label>
                    <Input
                      id="pageName"
                      value={formData.pageName}
                      onChange={(e) => {
                        const name = e.target.value;
                        setFormData({ 
                          ...formData, 
                          pageName: name,
                          slug: generateSlug(name)
                        });
                      }}
                      placeholder="e.g., About Us, Privacy Policy"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Internal name for the page
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="slug">Page Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="about-us"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      URL: /{formData.slug || 'page-slug'}
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="pageTitle">Page Title *</Label>
                  <Input
                    id="pageTitle"
                    value={formData.pageTitle}
                    onChange={(e) => setFormData({ ...formData, pageTitle: e.target.value })}
                    placeholder="e.g., About Indra Developers"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Main heading displayed on the page
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">Page Content</Label>
                  <RichTextEditor
                    value={formData.description || ''}
                    onChange={(value) => setFormData({ ...formData, description: value })}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Full page content with rich text formatting
                  </p>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Published' | 'Draft' })}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>

              {/* SEO Settings */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg border-b pb-2">SEO Settings</h3>
                
                <div>
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={formData.seo?.metaTitle}
                    onChange={(e) => setFormData({
                      ...formData,
                      seo: { ...formData.seo!, metaTitle: e.target.value }
                    })}
                    placeholder="SEO optimized title (50-60 characters)"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Characters: {formData.seo?.metaTitle?.length || 0}/60
                  </p>
                </div>

                <div>
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={formData.seo?.metaDescription}
                    onChange={(e) => setFormData({
                      ...formData,
                      seo: { ...formData.seo!, metaDescription: e.target.value }
                    })}
                    placeholder="Brief description for search engines (150-160 characters)"
                    rows={3}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Characters: {formData.seo?.metaDescription?.length || 0}/160
                  </p>
                </div>

                <div>
                  <Label htmlFor="keywords">Keywords</Label>
                  <Input
                    id="keywords"
                    value={formData.seo?.keywords}
                    onChange={(e) => setFormData({
                      ...formData,
                      seo: { ...formData.seo!, keywords: e.target.value }
                    })}
                    placeholder="Comma separated keywords"
                  />
                </div>

                <div>
                  <Label>OG Image (Social Media)</Label>
                  <p className="text-xs text-slate-500 mb-2">
                    Image shown when shared on social media
                  </p>
                  <ImageUpload
                    value={formData.seo?.ogImage || ''}
                    onChange={(value) => setFormData({
                      ...formData,
                      seo: { ...formData.seo!, ogImage: value }
                    })}
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingId ? 'Update' : 'Create'} Page
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}