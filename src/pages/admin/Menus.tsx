import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getData, setData } from '../../utils/localStorage';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner@2.0.3';
import { Plus, Trash2, GripVertical, Facebook, Twitter, Instagram, Linkedin, Youtube, Mail } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ImageUpload } from '../../components/ImageUpload';

export function Menus() {
  const [menus, setMenus] = useState<any>({
    topNavigation: [],
    footerQuickLinks: [],
    footerProjects: [],
    footerInfo: {
      logo: '',
      description: '',
      socialMedia: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: ''
      }
    }
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedMenus = getData('menus');
    if (savedMenus) {
      setMenus({
        ...menus,
        ...savedMenus
      });
    }
  };

  const handleSave = () => {
    setData('menus', menus);
    toast.success('Menus saved successfully!');
  };

  const addMenuItem = (menuType: 'topNavigation' | 'footerQuickLinks' | 'footerProjects') => {
    const newItem = {
      id: Date.now().toString(),
      label: '',
      url: ''
    };
    setMenus({
      ...menus,
      [menuType]: [...menus[menuType], newItem]
    });
  };

  const updateMenuItem = (menuType: string, index: number, field: string, value: string) => {
    const updated = [...menus[menuType]];
    updated[index] = { ...updated[index], [field]: value };
    setMenus({ ...menus, [menuType]: updated });
  };

  const deleteMenuItem = (menuType: string, index: number) => {
    const updated = menus[menuType].filter((_: any, i: number) => i !== index);
    setMenus({ ...menus, [menuType]: updated });
  };

  const updateFooterInfo = (field: string, value: string) => {
    setMenus({
      ...menus,
      footerInfo: {
        ...menus.footerInfo,
        [field]: value
      }
    });
  };

  const updateSocialMedia = (platform: string, value: string) => {
    setMenus({
      ...menus,
      footerInfo: {
        ...menus.footerInfo,
        socialMedia: {
          ...menus.footerInfo.socialMedia,
          [platform]: value
        }
      }
    });
  };

  const socialIcons: any = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    linkedin: Linkedin,
    youtube: Youtube
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl">Menus Management</h1>
          <Button onClick={handleSave}>
            Save All Changes
          </Button>
        </div>

        <Tabs defaultValue="top-nav" className="space-y-6">
          <TabsList>
            <TabsTrigger value="top-nav">Top Navigation</TabsTrigger>
            <TabsTrigger value="footer-quicklinks">Footer Quick Links</TabsTrigger>
            <TabsTrigger value="footer-projects">Footer Projects</TabsTrigger>
            <TabsTrigger value="footer-info">Footer Info & Social</TabsTrigger>
          </TabsList>

          {/* Top Navigation */}
          <TabsContent value="top-nav">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl">Top Navigation Menu</h2>
                  <p className="text-sm text-gray-600 mt-1">Manage the main navigation menu in the header</p>
                </div>
                <Button onClick={() => addMenuItem('topNavigation')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Menu Item
                </Button>
              </div>

              <div className="space-y-3">
                {menus.topNavigation.map((item: any, index: number) => (
                  <div key={item.id} className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50">
                    <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Label</Label>
                        <Input
                          value={item.label}
                          onChange={(e) => updateMenuItem('topNavigation', index, 'label', e.target.value)}
                          placeholder="Menu Label"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">URL</Label>
                        <Input
                          value={item.url}
                          onChange={(e) => updateMenuItem('topNavigation', index, 'url', e.target.value)}
                          placeholder="/page-url"
                        />
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMenuItem('topNavigation', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {menus.topNavigation.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No menu items yet. Click "Add Menu Item" to create your first menu item.
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Footer Quick Links */}
          <TabsContent value="footer-quicklinks">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl">Footer Quick Links</h2>
                  <p className="text-sm text-gray-600 mt-1">Quick access links in the footer</p>
                </div>
                <Button onClick={() => addMenuItem('footerQuickLinks')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
              </div>

              <div className="space-y-3">
                {menus.footerQuickLinks.map((item: any, index: number) => (
                  <div key={item.id} className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50">
                    <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Label</Label>
                        <Input
                          value={item.label}
                          onChange={(e) => updateMenuItem('footerQuickLinks', index, 'label', e.target.value)}
                          placeholder="Link Label"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">URL</Label>
                        <Input
                          value={item.url}
                          onChange={(e) => updateMenuItem('footerQuickLinks', index, 'url', e.target.value)}
                          placeholder="/page-url"
                        />
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMenuItem('footerQuickLinks', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {menus.footerQuickLinks.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No quick links yet. Click "Add Link" to create your first link.
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Footer Projects */}
          <TabsContent value="footer-projects">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl">Footer Our Projects</h2>
                  <p className="text-sm text-gray-600 mt-1">Featured projects links in the footer</p>
                </div>
                <Button onClick={() => addMenuItem('footerProjects')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project Link
                </Button>
              </div>

              <div className="space-y-3">
                {menus.footerProjects.map((item: any, index: number) => (
                  <div key={item.id} className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50">
                    <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Project Name</Label>
                        <Input
                          value={item.label}
                          onChange={(e) => updateMenuItem('footerProjects', index, 'label', e.target.value)}
                          placeholder="Project Name"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">URL</Label>
                        <Input
                          value={item.url}
                          onChange={(e) => updateMenuItem('footerProjects', index, 'url', e.target.value)}
                          placeholder="/projects/project-id"
                        />
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMenuItem('footerProjects', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {menus.footerProjects.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No project links yet. Click "Add Project Link" to create your first link.
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Footer Info & Social Media */}
          <TabsContent value="footer-info">
            <div className="space-y-6">
              {/* Footer Logo & Description */}
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl mb-6">Footer Logo & Description</h2>
                
                <div className="space-y-4">
                  <ImageUpload
                    label="Footer Logo"
                    value={menus.footerInfo.logo || ''}
                    onChange={(value) => updateFooterInfo('logo', value)}
                  />

                  <div>
                    <Label>Footer Description</Label>
                    <Textarea
                      value={menus.footerInfo.description || ''}
                      onChange={(e) => updateFooterInfo('description', e.target.value)}
                      placeholder="A brief description about your company that appears in the footer"
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl mb-6">Social Media Links</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(socialIcons).map(([platform, Icon]) => (
                    <div key={platform} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <Label className="text-xs capitalize">{platform}</Label>
                        <Input
                          value={menus.footerInfo.socialMedia[platform] || ''}
                          onChange={(e) => updateSocialMedia(platform, e.target.value)}
                          placeholder={`https://${platform}.com/yourpage`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl mb-6">Preview</h2>
                <div className="bg-gray-900 text-white p-8 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                      {menus.footerInfo.logo ? (
                        <img src={menus.footerInfo.logo} alt="Logo" className="h-12 mb-4" />
                      ) : (
                        <div className="h-12 bg-white/10 rounded mb-4 flex items-center justify-center text-xs">Logo</div>
                      )}
                      <p className="text-sm text-gray-400">
                        {menus.footerInfo.description || 'Footer description will appear here'}
                      </p>
                      <div className="flex gap-3 mt-4">
                        {Object.entries(menus.footerInfo.socialMedia).map(([platform, url]) => {
                          if (!url) return null;
                          const Icon = socialIcons[platform];
                          return (
                            <div key={platform} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                              <Icon className="h-4 w-4" />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                      <h3 className="font-semibold mb-4">Quick Links</h3>
                      <ul className="space-y-2 text-sm text-gray-400">
                        {menus.footerQuickLinks.length > 0 ? (
                          menus.footerQuickLinks.map((link: any) => (
                            <li key={link.id}>{link.label || 'Link'}</li>
                          ))
                        ) : (
                          <li>No links</li>
                        )}
                      </ul>
                    </div>

                    {/* Projects */}
                    <div>
                      <h3 className="font-semibold mb-4">Our Projects</h3>
                      <ul className="space-y-2 text-sm text-gray-400">
                        {menus.footerProjects.length > 0 ? (
                          menus.footerProjects.map((link: any) => (
                            <li key={link.id}>{link.label || 'Project'}</li>
                          ))
                        ) : (
                          <li>No projects</li>
                        )}
                      </ul>
                    </div>

                    {/* Contact */}
                    <div>
                      <h3 className="font-semibold mb-4">Contact</h3>
                      <div className="space-y-2 text-sm text-gray-400">
                        <p>Contact info from settings</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-6 border-t">
          <Button onClick={handleSave} size="lg">
            Save All Menu Changes
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
