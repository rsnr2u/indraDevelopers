import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getData, setData } from '../../utils/localStorage';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { toast } from 'sonner@2.0.3';
import { ImageUpload } from '../../components/ImageUpload';

export function SEO() {
  const [activeSection, setActiveSection] = useState('general');
  const [seoSettings, setSeoSettings] = useState<any>({
    general: {},
    analytics: {},
    webmaster: {},
    robots: {},
    sitemap: {},
    socialMeta: {},
    schema: {},
    indexing: {}
  });

  useEffect(() => {
    const settings = getData('seoSettings');
    if (settings) {
      setSeoSettings(settings);
    }
  }, []);

  const handleSave = () => {
    setData('seoSettings', seoSettings);
    toast.success('SEO settings saved successfully!');
  };

  const updateSection = (section: string, field: string, value: any) => {
    setSeoSettings({
      ...seoSettings,
      [section]: {
        ...seoSettings[section],
        [field]: value
      }
    });
  };

  const sections = [
    { id: 'general', label: 'General SEO' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'webmaster', label: 'Webmaster Tools' },
    { id: 'robots', label: 'Robots.txt' },
    { id: 'sitemap', label: 'Sitemap' },
    { id: 'socialMeta', label: 'Social Meta' },
    { id: 'schema', label: 'Schema Markup' },
    { id: 'indexing', label: 'Indexing' }
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl mb-4">SEO Management</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1">
            <div className="bg-white p-3 rounded-lg border space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white p-4 rounded-lg border">
              {activeSection === 'general' && (
                <div className="space-y-3">
                  <h2 className="text-xl mb-3">General SEO Settings</h2>
                  <div>
                    <Label>Site Title</Label>
                    <Input
                      value={seoSettings.general?.siteTitle || ''}
                      onChange={(e) => updateSection('general', 'siteTitle', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Meta Description</Label>
                    <Textarea
                      value={seoSettings.general?.metaDescription || ''}
                      onChange={(e) => updateSection('general', 'metaDescription', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Keywords</Label>
                    <Input
                      value={seoSettings.general?.keywords || ''}
                      onChange={(e) => updateSection('general', 'keywords', e.target.value)}
                    />
                  </div>
                  <ImageUpload
                    label="Favicon"
                    value={seoSettings.general?.favicon || ''}
                    onChange={(value) => updateSection('general', 'favicon', value)}
                  />
                </div>
              )}

              {activeSection === 'analytics' && (
                <div className="space-y-3">
                  <h2 className="text-xl mb-3">Analytics Settings</h2>
                  <div>
                    <Label>Google Analytics ID</Label>
                    <Input
                      value={seoSettings.analytics?.googleAnalyticsId || ''}
                      onChange={(e) => updateSection('analytics', 'googleAnalyticsId', e.target.value)}
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <Label>Google Tag Manager ID</Label>
                    <Input
                      value={seoSettings.analytics?.googleTagManagerId || ''}
                      onChange={(e) => updateSection('analytics', 'googleTagManagerId', e.target.value)}
                      placeholder="GTM-XXXXXX"
                    />
                  </div>
                  <div>
                    <Label>Facebook Pixel ID</Label>
                    <Input
                      value={seoSettings.analytics?.facebookPixelId || ''}
                      onChange={(e) => updateSection('analytics', 'facebookPixelId', e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={seoSettings.analytics?.enableTracking || false}
                      onCheckedChange={(checked) => updateSection('analytics', 'enableTracking', checked)}
                    />
                    <Label>Enable Tracking</Label>
                  </div>
                </div>
              )}

              {activeSection === 'webmaster' && (
                <div className="space-y-3">
                  <h2 className="text-xl mb-3">Webmaster Tools</h2>
                  <div>
                    <Label>Google Verification Code</Label>
                    <Input
                      value={seoSettings.webmaster?.googleVerification || ''}
                      onChange={(e) => updateSection('webmaster', 'googleVerification', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Bing Verification Code</Label>
                    <Input
                      value={seoSettings.webmaster?.bingVerification || ''}
                      onChange={(e) => updateSection('webmaster', 'bingVerification', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {activeSection === 'robots' && (
                <div className="space-y-3">
                  <h2 className="text-xl mb-3">Robots.txt</h2>
                  <div>
                    <Label>Robots.txt Content</Label>
                    <Textarea
                      value={seoSettings.robots?.content || ''}
                      onChange={(e) => updateSection('robots', 'content', e.target.value)}
                      rows={10}
                    />
                  </div>
                </div>
              )}

              {activeSection === 'sitemap' && (
                <div className="space-y-3">
                  <h2 className="text-xl mb-3">Sitemap Configuration</h2>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={seoSettings.sitemap?.enabled || false}
                      onCheckedChange={(checked) => updateSection('sitemap', 'enabled', checked)}
                    />
                    <Label>Enable Sitemap</Label>
                  </div>
                  <div>
                    <Label>Update Frequency</Label>
                    <select
                      value={seoSettings.sitemap?.frequency || 'weekly'}
                      onChange={(e) => updateSection('sitemap', 'frequency', e.target.value)}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
              )}

              {activeSection === 'socialMeta' && (
                <div className="space-y-3">
                  <h2 className="text-xl mb-3">Social Media Meta Tags</h2>
                  <div>
                    <Label>Open Graph Title</Label>
                    <Input
                      value={seoSettings.socialMeta?.ogTitle || ''}
                      onChange={(e) => updateSection('socialMeta', 'ogTitle', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Open Graph Description</Label>
                    <Textarea
                      value={seoSettings.socialMeta?.ogDescription || ''}
                      onChange={(e) => updateSection('socialMeta', 'ogDescription', e.target.value)}
                    />
                  </div>
                  <ImageUpload
                    label="Open Graph Image"
                    value={seoSettings.socialMeta?.ogImage || ''}
                    onChange={(value) => updateSection('socialMeta', 'ogImage', value)}
                  />
                </div>
              )}

              {activeSection === 'schema' && (
                <div className="space-y-3">
                  <h2 className="text-xl mb-3">Schema Markup</h2>
                  <div>
                    <Label>Organization Name</Label>
                    <Input
                      value={seoSettings.schema?.organizationName || ''}
                      onChange={(e) => updateSection('schema', 'organizationName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Contact Phone</Label>
                    <Input
                      value={seoSettings.schema?.contactPhone || ''}
                      onChange={(e) => updateSection('schema', 'contactPhone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Contact Email</Label>
                    <Input
                      value={seoSettings.schema?.contactEmail || ''}
                      onChange={(e) => updateSection('schema', 'contactEmail', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {activeSection === 'indexing' && (
                <div className="space-y-3">
                  <h2 className="text-xl mb-3">Indexing Settings</h2>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={seoSettings.indexing?.allowIndexing || false}
                      onCheckedChange={(checked) => updateSection('indexing', 'allowIndexing', checked)}
                    />
                    <Label>Allow Search Engine Indexing</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={seoSettings.indexing?.noFollow || false}
                      onCheckedChange={(checked) => updateSection('indexing', 'noFollow', checked)}
                    />
                    <Label>No Follow</Label>
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t">
                <Button onClick={handleSave} className="w-full">
                  Save SEO Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
