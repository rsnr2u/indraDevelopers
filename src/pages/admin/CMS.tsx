import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getData, setData } from '../../utils/localStorage';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner@2.0.3';
import { ImageUpload } from '../../components/ImageUpload';
import { RichTextEditor } from '../../components/RichTextEditor';
import { Plus, Trash2, GripVertical } from 'lucide-react';

export function CMS() {
  const [activeSection, setActiveSection] = useState('home');
  const [cmsPages, setCmsPages] = useState<any>({
    home: { banners: [], stats: [] },
    about: {},
    contact: {}
  });

  useEffect(() => {
    const pages = getData('cmsPages');
    if (pages) {
      setCmsPages({
        home: {
          banners: pages.home?.banners || [],
          stats: pages.home?.stats || [
            { id: '1', label: 'Active Projects', value: '3+', icon: 'building' },
            { id: '2', label: 'Happy Clients', value: '500+', icon: 'users' },
            { id: '3', label: 'Years Experience', value: '15+', icon: 'calendar' },
            { id: '4', label: 'Success Rate', value: '95%', icon: 'trophy' }
          ],
          ...pages.home
        },
        about: pages.about || {},
        contact: pages.contact || {}
      });
    } else {
      // Initialize with default values if no data exists
      setCmsPages({
        home: {
          banners: [],
          stats: [
            { id: '1', label: 'Active Projects', value: '3+', icon: 'building' },
            { id: '2', label: 'Happy Clients', value: '500+', icon: 'users' },
            { id: '3', label: 'Years Experience', value: '15+', icon: 'calendar' },
            { id: '4', label: 'Success Rate', value: '95%', icon: 'trophy' }
          ]
        },
        about: {},
        contact: {}
      });
    }
  }, []);

  const handleSave = () => {
    setData('cmsPages', cmsPages);
    toast.success('CMS content saved successfully!');
  };

  const updatePage = (page: string, field: string, value: any) => {
    setCmsPages({
      ...cmsPages,
      [page]: {
        ...cmsPages[page],
        [field]: value
      }
    });
  };

  const sections = [
    { id: 'home', label: 'Home Page' },
    { id: 'about', label: 'About Page' },
    { id: 'contact', label: 'Contact Page' }
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl mb-4">CMS Content Management</h1>

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
              {activeSection === 'home' && (
                <div className="space-y-6">
                  <h2 className="text-xl mb-3">Home Page Content</h2>
                  
                  {/* Banner Carousel Section */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Banner Carousel</h3>
                      <Button
                        size="sm"
                        onClick={() => {
                          const newBanner = {
                            id: Date.now().toString(),
                            title: '',
                            subtitle: '',
                            description: '',
                            image: '',
                            buttonText: 'Explore Projects',
                            buttonLink: '/projects'
                          };
                          updatePage('home', 'banners', [...(cmsPages.home?.banners || []), newBanner]);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Banner
                      </Button>
                    </div>

                    {(cmsPages.home?.banners || []).length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        No banners added yet. Click "Add Banner" to create your first banner slide.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {(cmsPages.home?.banners || []).map((banner: any, index: number) => (
                          <div key={banner.id} className="bg-white border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <GripVertical className="h-4 w-4 text-gray-400" />
                                <span className="font-medium">Banner {index + 1}</span>
                              </div>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  const updatedBanners = cmsPages.home.banners.filter(
                                    (_: any, i: number) => i !== index
                                  );
                                  updatePage('home', 'banners', updatedBanners);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <Label>Title</Label>
                                <Input
                                  value={banner.title || ''}
                                  onChange={(e) => {
                                    const updatedBanners = [...cmsPages.home.banners];
                                    updatedBanners[index].title = e.target.value;
                                    updatePage('home', 'banners', updatedBanners);
                                  }}
                                  placeholder="Banner Title"
                                />
                              </div>
                              <div>
                                <Label>Subtitle</Label>
                                <Input
                                  value={banner.subtitle || ''}
                                  onChange={(e) => {
                                    const updatedBanners = [...cmsPages.home.banners];
                                    updatedBanners[index].subtitle = e.target.value;
                                    updatePage('home', 'banners', updatedBanners);
                                  }}
                                  placeholder="Banner Subtitle"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Label>Description</Label>
                                <Textarea
                                  value={banner.description || ''}
                                  onChange={(e) => {
                                    const updatedBanners = [...cmsPages.home.banners];
                                    updatedBanners[index].description = e.target.value;
                                    updatePage('home', 'banners', updatedBanners);
                                  }}
                                  placeholder="Banner Description"
                                  rows={2}
                                />
                              </div>
                              <div>
                                <Label>Button Text</Label>
                                <Input
                                  value={banner.buttonText || ''}
                                  onChange={(e) => {
                                    const updatedBanners = [...cmsPages.home.banners];
                                    updatedBanners[index].buttonText = e.target.value;
                                    updatePage('home', 'banners', updatedBanners);
                                  }}
                                  placeholder="e.g., Explore Projects"
                                />
                              </div>
                              <div>
                                <Label>Button Link</Label>
                                <Input
                                  value={banner.buttonLink || ''}
                                  onChange={(e) => {
                                    const updatedBanners = [...cmsPages.home.banners];
                                    updatedBanners[index].buttonLink = e.target.value;
                                    updatePage('home', 'banners', updatedBanners);
                                  }}
                                  placeholder="e.g., /projects"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <ImageUpload
                                  label="Banner Image"
                                  value={banner.image || ''}
                                  onChange={(value) => {
                                    const updatedBanners = [...cmsPages.home.banners];
                                    updatedBanners[index].image = value;
                                    updatePage('home', 'banners', updatedBanners);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Statistics Section */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Statistics Counter</h3>
                      <Button
                        size="sm"
                        onClick={() => {
                          const newStat = {
                            id: Date.now().toString(),
                            label: '',
                            value: '',
                            icon: 'building'
                          };
                          updatePage('home', 'stats', [...(cmsPages.home?.stats || []), newStat]);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Stat
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(cmsPages.home?.stats || []).map((stat: any, index: number) => (
                        <div key={stat.id || index} className="bg-white border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Stat {index + 1}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const updatedStats = cmsPages.home.stats.filter(
                                  (_: any, i: number) => i !== index
                                );
                                updatePage('home', 'stats', updatedStats);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <Label className="text-xs">Value (e.g., 500+)</Label>
                              <Input
                                value={stat.value || ''}
                                onChange={(e) => {
                                  const updatedStats = [...cmsPages.home.stats];
                                  updatedStats[index].value = e.target.value;
                                  updatePage('home', 'stats', updatedStats);
                                }}
                                placeholder="500+"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Label</Label>
                              <Input
                                value={stat.label || ''}
                                onChange={(e) => {
                                  const updatedStats = [...cmsPages.home.stats];
                                  updatedStats[index].label = e.target.value;
                                  updatePage('home', 'stats', updatedStats);
                                }}
                                placeholder="Happy Clients"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Icon</Label>
                              <select
                                value={stat.icon || 'building'}
                                onChange={(e) => {
                                  const updatedStats = [...cmsPages.home.stats];
                                  updatedStats[index].icon = e.target.value;
                                  updatePage('home', 'stats', updatedStats);
                                }}
                                className="w-full border rounded px-2 py-1.5 text-sm"
                              >
                                <option value="building">Building</option>
                                <option value="users">Users</option>
                                <option value="calendar">Calendar</option>
                                <option value="trophy">Trophy</option>
                                <option value="star">Star</option>
                                <option value="heart">Heart</option>
                                <option value="check">Check</option>
                                <option value="award">Award</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'about' && (
                <div className="space-y-3">
                  <h2 className="text-xl mb-3">About Page Content</h2>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={cmsPages.about?.title || ''}
                      onChange={(e) => updatePage('about', 'title', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Content</Label>
                    <RichTextEditor
                      value={cmsPages.about?.content || ''}
                      onChange={(value) => updatePage('about', 'content', value)}
                    />
                  </div>
                  <div>
                    <Label>Vision</Label>
                    <Textarea
                      value={cmsPages.about?.vision || ''}
                      onChange={(e) => updatePage('about', 'vision', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Mission</Label>
                    <Textarea
                      value={cmsPages.about?.mission || ''}
                      onChange={(e) => updatePage('about', 'mission', e.target.value)}
                    />
                  </div>
                  <ImageUpload
                    label="About Image"
                    value={cmsPages.about?.image || ''}
                    onChange={(value) => updatePage('about', 'image', value)}
                  />
                </div>
              )}

              {activeSection === 'contact' && (
                <div className="space-y-3">
                  <h2 className="text-xl mb-3">Contact Page Content</h2>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={cmsPages.contact?.title || ''}
                      onChange={(e) => updatePage('contact', 'title', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Address</Label>
                    <Textarea
                      value={cmsPages.contact?.address || ''}
                      onChange={(e) => updatePage('contact', 'address', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={cmsPages.contact?.phone || ''}
                      onChange={(e) => updatePage('contact', 'phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      value={cmsPages.contact?.email || ''}
                      onChange={(e) => updatePage('contact', 'email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Working Hours</Label>
                    <Input
                      value={cmsPages.contact?.workingHours || ''}
                      onChange={(e) => updatePage('contact', 'workingHours', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Map Embed URL</Label>
                    <Input
                      value={cmsPages.contact?.mapEmbedUrl || ''}
                      onChange={(e) => updatePage('contact', 'mapEmbedUrl', e.target.value)}
                      placeholder="https://www.google.com/maps/embed?pb=..."
                    />
                  </div>
                </div>
              )}

              {activeSection === 'gallery' && (
                <div className="space-y-3">
                  <h2 className="text-xl mb-3">Gallery Management</h2>
                  <p className="text-gray-600">
                    Gallery images can be uploaded here. This section will be expanded with image management features.
                  </p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t">
                <Button onClick={handleSave} className="w-full">
                  Save CMS Content
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}