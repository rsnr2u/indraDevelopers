import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getData, addItem, updateItem, deleteItem } from '../../utils/localStorage';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

export function Projects() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'category' | 'location'>('category');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setCategories(await getData('projectCategories') || []);
    setLocations(await getData('locations') || []);
    setProjects(await getData('projects') || []);
  };

  const handleSaveCategory = async () => {
    if (!formData.name) {
      toast.error('Please enter category name');
      return;
    }

    const slug = formData.name.toLowerCase().replace(/\s+/g, '-');

    if (editingItem) {
      await updateItem('projectCategories', editingItem.id, { name: formData.name, slug });
      toast.success('Category updated successfully!');
    } else {
      await addItem('projectCategories', { name: formData.name, slug });
      toast.success('Category added successfully!');
    }

    loadData();
    setIsDialogOpen(false);
    setFormData({});
    setEditingItem(null);
  };

  const handleSaveLocation = async () => {
    if (!formData.name) {
      toast.error('Please enter location name');
      return;
    }

    const slug = formData.name.toLowerCase().replace(/\s+/g, '-');

    if (editingItem) {
      await updateItem('locations', editingItem.id, { name: formData.name, slug });
      toast.success('Location updated successfully!');
    } else {
      await addItem('locations', { name: formData.name, slug });
      toast.success('Location added successfully!');
    }

    loadData();
    setIsDialogOpen(false);
    setFormData({});
    setEditingItem(null);
  };

  const handleDelete = async (id: string, type: 'projects' | 'projectCategories' | 'locations') => { // Note: Removed literals to avoid type mismatch if any
    if (!confirm('Are you sure you want to delete this item?')) return;

    // TypeScript might complain about string vs literal, keeping simple type: string
    await deleteItem(type, id);
    loadData();
    toast.success('Item deleted successfully!');
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl mb-6">Projects Management</h1>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl">All Projects</h2>
                <Button onClick={() => navigate('/admin/projects/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </div>

              <div className="space-y-2">
                {projects.map((project) => (
                  <div key={project.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg">{project.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {categories.find(c => c.id === project.categoryId)?.name} • {locations.find(l => l.id === project.locationId)?.name}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded inline-block mt-2 ${project.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                          {project.status}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/projects/edit/${project.id}`)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(project.id, 'projects')}
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
                <h2 className="text-xl">Project Categories</h2>
                <Button onClick={() => {
                  setDialogType('category');
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
                          setDialogType('category');
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
                        onClick={() => handleDelete(category.id, 'projectCategories')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="locations">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl">Locations</h2>
                <Button onClick={() => {
                  setDialogType('location');
                  setEditingItem(null);
                  setFormData({});
                  setIsDialogOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </div>

              <div className="space-y-2">
                {locations.map((location) => (
                  <div key={location.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p>{location.name}</p>
                      <p className="text-sm text-gray-500">{location.slug}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setDialogType('location');
                          setEditingItem(location);
                          setFormData(location);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(location.id, 'locations')}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit' : 'Add'} {dialogType === 'category' ? 'Category' : 'Location'}
            </DialogTitle>
            <DialogDescription>
              {editingItem ? 'Make changes to your item below.' : 'Add a new item below.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {dialogType === 'category' && (
              <>
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
              </>
            )}

            {dialogType === 'location' && (
              <>
                <div>
                  <Label>Location Name</Label>
                  <Input
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <Button onClick={handleSaveLocation} className="w-full">
                  Save Location
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}