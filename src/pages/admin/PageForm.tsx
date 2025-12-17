import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { getData, addItem, updateItem } from '../../utils/localStorage';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
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
    index: boolean;
  };
  status: 'Published' | 'Draft';
  createdAt: string;
  updatedAt: string;
}

export function PageForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState<Partial<Page>>({
    pageName: '',
    pageTitle: '',
    slug: '',
    description: '',
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: '',
      ogImage: '',
      index: true
    },
    status: 'Draft'
  });

  useEffect(() => {
    if (id) {
      const pages = getData('customPages') || [];
      const page = pages.find((p: any) => p.id === id);
      if (page) {
        setFormData({
          ...page,
          seo: {
            ...page.seo,
            index: page.seo?.index !== false // Default to true if not set
          }
        });
      }
    }
  }, [id]);

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

    if (id) {
      updateItem('customPages', id, pageData);
      toast.success('Page updated successfully!');
    } else {
      addItem('customPages', pageData);
      toast.success('Page created successfully!');
    }

    navigate('/admin/pages');
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/pages')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl">{id ? 'Edit' : 'Create'} Page</h1>
              <p className="text-slate-600 mt-1">
                {id ? 'Update page details and SEO settings' : 'Create a new custom page with SEO optimization'}
              </p>
            </div>
          </div>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            {id ? 'Update' : 'Create'} Page
          </Button>
        </div>

        <Card className="p-6">
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
                  <Label htmlFor="slug">Page Slug *</Label>
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

              {/* Index/No-Index */}
              <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-lg">
                <input
                  type="checkbox"
                  id="index"
                  checked={formData.seo?.index !== false}
                  onChange={(e) => setFormData({
                    ...formData,
                    seo: { ...formData.seo!, index: e.target.checked }
                  })}
                  className="h-4 w-4"
                />
                <div>
                  <Label htmlFor="index" className="cursor-pointer">
                    Allow Search Engine Indexing
                  </Label>
                  <p className="text-xs text-slate-500 mt-1">
                    {formData.seo?.index !== false
                      ? 'This page will be indexed by search engines (robots meta tag: index, follow)'
                      : 'This page will NOT be indexed by search engines (robots meta tag: noindex, nofollow)'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => navigate('/admin/pages')}
              >
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                {id ? 'Update' : 'Create'} Page
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
