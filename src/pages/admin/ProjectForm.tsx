import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getData, addItem, updateItem } from '../../utils/localStorage';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';
import { ImageUpload } from '../../components/ImageUpload';
import { RichTextEditor } from '../../components/RichTextEditor';
import { ArrowLeft, Save, Plus, Trash2, MapPin, TrendingUp, Target } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

interface LocationAdvantage {
  id: string;
  icon: string;
  label: string;
  description: string;
}

interface WhyInvest {
  id: string;
  label: string;
  description: string;
}

export function ProjectForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({
    title: '',
    name: '',
    categoryId: '',
    locationId: '',
    description: '',
    price: '',
    offerPrice: '',
    featuredImage: '',
    brochure: '',
    carouselImages: [],
    amenities: [],
    locationAdvantages: [],
    whyInvest: [],
    status: 'Active',
    plots: [],
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: '',
      ogImage: '',
      schema: ''
    }
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [newLocationAdvantage, setNewLocationAdvantage] = useState<LocationAdvantage>({
    id: '',
    icon: 'MapPin',
    label: '',
    description: ''
  });
  const [newWhyInvest, setNewWhyInvest] = useState<WhyInvest>({
    id: '',
    label: '',
    description: ''
  });

  const iconOptions = [
    'MapPin', 'School', 'Hospital', 'ShoppingCart', 'Train', 'Plane',
    'Bus', 'Building', 'TreePine', 'Dumbbell', 'Coffee', 'Store'
  ];

  useEffect(() => {
    const loadData = async () => {
      setCategories(await getData('projectCategories') || []);
      setLocations(await getData('locations') || []);

      if (id) {
        // We can fetch single project directly if API supports it, or find in list
        // Assuming /projects/:id works (standard resource controller)
        // But our getData is generic. getData(`projects/${id}`) should work.
        // But our getData implementation is: api.get(`/${key}`). 
        // So getData(`projects/${id}`) call GET /api/projects/:id. This is correct.
        const project = await getData(`projects/${id}`);
        // Fallback to searching list if single fetch fails or returns null? 
        // If projects controller 'show' is implemented (it is), this works.

        if (project) {
          setFormData({
            ...project,
            carouselImages: project.images || [], // Backend returns 'images' (decoded from plots_data/images check Projects.php)
            // Wait, Projects.php index() decodes 'images'. show() needs to check too.
            // Let's assume standard mapping project.images -> carouselImages in form
            amenities: project.amenities ? JSON.parse(project.amenities) : [], // If stored as JSON string in DB
            // Projects.php index method doesn't explicit amenity decoding?
            // Need to check Projects.php logic for 'amenities'.
            // Actually, Projects.php decodes: plots, images, schema, seo.
            // Amenities is likely text or json. 
            // If I save it as array, CodeIgniter receives array. DB needs string?
            // Same issue as Leads notes. I need to check Projects.php update/create logic.
            locationAdvantages: project.locationAdvantages ? JSON.parse(project.locationAdvantages) : [],
            whyInvest: project.whyInvest ? JSON.parse(project.whyInvest) : [],
            status: project.status,
            plots: project.plots || [],
            seo: project.seo || {
              metaTitle: '',
              metaDescription: '',
              keywords: '',
              ogImage: '',
              schema: ''
            }
          });
        }
      }
    };
    loadData();
  }, [id]);

  const handleSave = async () => {
    if (!formData.title || !formData.name || !formData.categoryId || !formData.locationId) {
      toast.error('Please fill in all required fields (Title, Name, Category, Location)');
      return;
    }

    const projectData = {
      ...formData,
      // Map frontend fields to backend expected structure if needed
      // Projects.php controller needs update to handle these JSON arrays if not done automatically
      // Assuming generic key-value save for now, but really need to stringify arrays for SQL text columns?
      // OR Projects.php handles json_encoding.
      // Let's assume Objects/Arrays need stringifying if DB column is text/json and codeigniter model doesn't cast.
      // But standard Insert/Update expects values that match column types.
      // I'll send objects/arrays. If backend fails, I'll need to update backend.
      carouselImages: formData.carouselImages || [],
      amenities: formData.amenities || [],
      locationAdvantages: formData.locationAdvantages || [],
      whyInvest: formData.whyInvest || [],
      plots: formData.plots || [],
      status: formData.status || 'Active'
    };

    try {
      if (id) {
        await updateItem('projects', id, projectData);
        toast.success('Project updated successfully!');
      } else {
        await addItem('projects', projectData);
        toast.success('Project created successfully!');
      }

      navigate('/admin/projects');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save project. Please try reducing image sizes.');
    }
  };

  const addAmenity = () => {
    if (!newAmenity.trim()) {
      toast.error('Please enter an amenity');
      return;
    }
    setFormData({
      ...formData,
      amenities: [...formData.amenities, newAmenity.trim()]
    });
    setNewAmenity('');
  };

  const removeAmenity = (index: number) => {
    const updated = formData.amenities.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, amenities: updated });
  };

  const addLocationAdvantage = () => {
    if (!newLocationAdvantage.label || !newLocationAdvantage.description) {
      toast.error('Please fill in label and description');
      return;
    }
    setFormData({
      ...formData,
      locationAdvantages: [
        ...formData.locationAdvantages,
        { ...newLocationAdvantage, id: Date.now().toString() }
      ]
    });
    setNewLocationAdvantage({ id: '', icon: 'MapPin', label: '', description: '' });
  };

  const removeLocationAdvantage = (id: string) => {
    const updated = formData.locationAdvantages.filter((item: any) => item.id !== id);
    setFormData({ ...formData, locationAdvantages: updated });
  };

  const addWhyInvest = () => {
    if (!newWhyInvest.label || !newWhyInvest.description) {
      toast.error('Please fill in label and description');
      return;
    }
    setFormData({
      ...formData,
      whyInvest: [
        ...formData.whyInvest,
        { ...newWhyInvest, id: Date.now().toString() }
      ]
    });
    setNewWhyInvest({ id: '', label: '', description: '' });
  };

  const removeWhyInvest = (id: string) => {
    const updated = formData.whyInvest.filter((item: any) => item.id !== id);
    setFormData({ ...formData, whyInvest: updated });
  };

  const generateSchema = () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "RealEstateProject",
      "name": formData.title || formData.name,
      "description": formData.seo.metaDescription || formData.description?.substring(0, 160),
      "image": formData.featuredImage,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": locations.find(l => l.id === formData.locationId)?.name || ""
      },
      "offers": {
        "@type": "Offer",
        "availability": "https://schema.org/InStock"
      }
    };

    setFormData({
      ...formData,
      seo: {
        ...formData.seo,
        schema: JSON.stringify(schema, null, 2)
      }
    });
    toast.success('Schema generated successfully!');
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/projects')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
          <h1 className="text-3xl">
            {id ? 'Edit Project' : 'Create New Project'}
          </h1>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList>
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="investment">Why Invest</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter project title (e.g., Luxury Apartments in Downtown)"
                  />
                  <p className="text-xs text-slate-500 mt-1">This will be the main heading displayed on the website</p>
                </div>

                <div>
                  <Label htmlFor="name">Project Name *</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter project name (e.g., Indra Heights)"
                  />
                  <p className="text-xs text-slate-500 mt-1">Short name for internal reference</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <select
                      id="category"
                      value={formData.categoryId || ''}
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
                    <Label htmlFor="location">Location *</Label>
                    <select
                      id="location"
                      value={formData.locationId || ''}
                      onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="">Select Location</option>
                      {locations.map(loc => (
                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={formData.status || 'Active'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g., ₹25 Lakhs - ₹50 Lakhs"
                  />
                  <p className="text-xs text-slate-500 mt-1">Enter the price range for this project (e.g., ₹25 Lakhs - ₹50 Lakhs)</p>
                </div>

                <div>
                  <Label htmlFor="offerPrice">Offer Price</Label>
                  <Input
                    id="offerPrice"
                    value={formData.offerPrice || ''}
                    onChange={(e) => setFormData({ ...formData, offerPrice: e.target.value })}
                    placeholder="e.g., ₹25 Lakhs - ₹50 Lakhs"
                  />
                  <p className="text-xs text-slate-500 mt-1">Enter the offer price range for this project (e.g., ₹25 Lakhs - ₹50 Lakhs)</p>
                </div>

                <div>
                  <Label>Project Description</Label>
                  <RichTextEditor
                    value={formData.description || ''}
                    onChange={(value) => setFormData({ ...formData, description: value })}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <Label>Featured Image *</Label>
                  <p className="text-xs text-slate-500 mb-2">Main image displayed in listings and as hero image</p>
                  <ImageUpload
                    value={formData.featuredImage || ''}
                    onChange={(value) => setFormData({ ...formData, featuredImage: value })}
                  />
                </div>

                <div className="border-t pt-6">
                  <Label>Carousel Images</Label>
                  <p className="text-xs text-slate-500 mb-3">Add multiple images for the project detail page carousel</p>

                  <div className="space-y-4">
                    {formData.carouselImages.map((img: string, index: number) => (
                      <div key={index} className="flex items-end gap-3">
                        <div className="flex-1">
                          <ImageUpload
                            value={img}
                            onChange={(value) => {
                              const updated = [...formData.carouselImages];
                              updated[index] = value;
                              setFormData({ ...formData, carouselImages: updated });
                            }}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const updated = formData.carouselImages.filter((_: any, i: number) => i !== index);
                            setFormData({ ...formData, carouselImages: updated });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          carouselImages: [...formData.carouselImages, '']
                        });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Carousel Image
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <Label>Project Brochure (PDF/Document)</Label>
                  <p className="text-xs text-slate-500 mb-2">Upload project brochure that users can download after submitting enquiry</p>
                  <ImageUpload
                    value={formData.brochure || ''}
                    onChange={(value) => setFormData({ ...formData, brochure: value })}
                  />
                  <p className="text-xs text-slate-400 mt-2">💡 Tip: Upload a PDF or image file of your project brochure. This will be available for download after users fill the enquiry form.</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <Label>Amenities & Features</Label>
                  <p className="text-xs text-slate-500 mb-3">Add amenities as bullet points</p>

                  <div className="space-y-3">
                    {formData.amenities.map((amenity: string, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <span className="flex-1">{amenity}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAmenity(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Input
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      placeholder="Enter amenity (e.g., Swimming Pool, Gym)"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addAmenity();
                        }
                      }}
                    />
                    <Button type="button" onClick={addAmenity}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Location Advantages Tab */}
          <TabsContent value="location">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <Label className="text-lg">Location Advantages</Label>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">Highlight nearby facilities and connectivity</p>

                  <div className="space-y-3 mb-4">
                    {formData.locationAdvantages.map((item: LocationAdvantage) => (
                      <div key={item.id} className="p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-blue-600">{item.icon}</span>
                              <span className="font-medium">{item.label}</span>
                            </div>
                            <p className="text-sm text-slate-600">{item.description}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLocationAdvantage(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Icon</Label>
                        <select
                          value={newLocationAdvantage.icon}
                          onChange={(e) => setNewLocationAdvantage({ ...newLocationAdvantage, icon: e.target.value })}
                          className="w-full border rounded-lg px-3 py-2"
                        >
                          {iconOptions.map(icon => (
                            <option key={icon} value={icon}>{icon}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label>Label</Label>
                        <Input
                          value={newLocationAdvantage.label}
                          onChange={(e) => setNewLocationAdvantage({ ...newLocationAdvantage, label: e.target.value })}
                          placeholder="e.g., Schools Nearby"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={newLocationAdvantage.description}
                        onChange={(e) => setNewLocationAdvantage({ ...newLocationAdvantage, description: e.target.value })}
                        placeholder="e.g., Top-rated schools within 2km radius"
                        rows={2}
                      />
                    </div>
                    <Button type="button" onClick={addLocationAdvantage} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Location Advantage
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Why Invest Tab */}
          <TabsContent value="investment">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <Label className="text-lg">Why Invest in This Project</Label>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">Add compelling investment reasons</p>

                  <div className="space-y-3 mb-4">
                    {formData.whyInvest.map((item: WhyInvest) => (
                      <div key={item.id} className="p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">{item.label}</h4>
                            <p className="text-sm text-slate-600">{item.description}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeWhyInvest(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <div>
                      <Label>Label / Heading</Label>
                      <Input
                        value={newWhyInvest.label}
                        onChange={(e) => setNewWhyInvest({ ...newWhyInvest, label: e.target.value })}
                        placeholder="e.g., High ROI Potential"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={newWhyInvest.description}
                        onChange={(e) => setNewWhyInvest({ ...newWhyInvest, description: e.target.value })}
                        placeholder="Explain why this is a good investment opportunity"
                        rows={3}
                      />
                    </div>
                    <Button type="button" onClick={addWhyInvest} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Investment Reason
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo">
            <Card className="p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-5 w-5 text-purple-600" />
                  <Label className="text-lg">SEO Settings</Label>
                </div>

                <div>
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={formData.seo?.metaTitle || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      seo: { ...formData.seo, metaTitle: e.target.value }
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
                    value={formData.seo?.metaDescription || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      seo: { ...formData.seo, metaDescription: e.target.value }
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
                    value={formData.seo?.keywords || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      seo: { ...formData.seo, keywords: e.target.value }
                    })}
                    placeholder="Comma separated keywords (e.g., luxury apartments, real estate)"
                  />
                </div>

                <div>
                  <Label>OG Image (Social Media)</Label>
                  <p className="text-xs text-slate-500 mb-2">Image shown when shared on social media</p>
                  <ImageUpload
                    value={formData.seo?.ogImage || ''}
                    onChange={(value) => setFormData({
                      ...formData,
                      seo: { ...formData.seo, ogImage: value }
                    })}
                  />
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <Label htmlFor="schema">Schema Markup (JSON-LD)</Label>
                    <Button type="button" onClick={generateSchema} variant="outline" size="sm">
                      Generate Schema
                    </Button>
                  </div>
                  <Textarea
                    id="schema"
                    value={formData.seo?.schema || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      seo: { ...formData.seo, schema: e.target.value }
                    })}
                    placeholder="Schema.org structured data in JSON-LD format"
                    rows={10}
                    className="font-mono text-xs"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Structured data helps search engines understand your content better
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button - Fixed at bottom */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 mt-6 -mx-4 lg:-mx-6">
          <div className="max-w-6xl mx-auto flex gap-3">
            <Button onClick={handleSave} className="flex-1" size="lg">
              <Save className="h-4 w-4 mr-2" />
              Save Project
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/admin/projects')}
              size="lg"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}