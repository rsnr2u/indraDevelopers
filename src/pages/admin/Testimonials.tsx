import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { getData, addItem, updateItem, deleteItem } from '../../utils/localStorage';
import { toast } from 'sonner@2.0.3';
import { Plus, Edit, Trash2, Star, Quote, Video } from 'lucide-react';
import { ImageUpload } from '../../components/ImageUpload';

interface Testimonial {
  id: string;
  name: string;
  designation: string;
  company: string;
  image: string;
  rating: number;
  testimonial: string;
  projectId: string;
  type: 'text' | 'video';
  videoUrl: string;
  featured: boolean;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    name: '',
    designation: '',
    company: '',
    image: '',
    rating: 5,
    testimonial: '',
    projectId: '',
    type: 'text',
    videoUrl: '',
    featured: false,
    status: 'Active'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTestimonials(getData('testimonials') || []);
    setProjects(getData('projects') || []);
  };

  const handleSave = () => {
    if (!formData.name || !formData.testimonial) {
      toast.error('Please fill in required fields');
      return;
    }

    const testimonialData = {
      ...formData,
      createdAt: formData.createdAt || new Date().toISOString()
    };

    if (editingId) {
      updateItem('testimonials', editingId, testimonialData);
      toast.success('Testimonial updated successfully!');
    } else {
      addItem('testimonials', testimonialData);
      toast.success('Testimonial added successfully!');
    }

    resetForm();
    loadData();
  };

  const handleEdit = (testimonial: Testimonial) => {
    setFormData(testimonial);
    setEditingId(testimonial.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      deleteItem('testimonials', id);
      toast.success('Testimonial deleted successfully!');
      loadData();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      designation: '',
      company: '',
      image: '',
      rating: 5,
      testimonial: '',
      projectId: '',
      type: 'text',
      videoUrl: '',
      featured: false,
      status: 'Active'
    });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
      />
    ));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2">Customer Testimonials</h1>
            <p className="text-slate-600">Manage customer reviews and testimonials</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Testimonial
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-slate-600 mb-1">Total Testimonials</p>
            <p className="text-2xl">{testimonials.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-slate-600 mb-1">Active</p>
            <p className="text-2xl text-green-600">
              {testimonials.filter(t => t.status === 'Active').length}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-slate-600 mb-1">Featured</p>
            <p className="text-2xl text-blue-600">
              {testimonials.filter(t => t.featured).length}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-slate-600 mb-1">Video Testimonials</p>
            <p className="text-2xl text-purple-600">
              {testimonials.filter(t => t.type === 'video').length}
            </p>
          </Card>
        </div>

        {/* Testimonials List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => {
            const project = projects.find(p => p.id === testimonial.projectId);
            return (
              <Card key={testimonial.id} className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  {testimonial.image ? (
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center">
                      <Quote className="h-6 w-6 text-slate-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{testimonial.name}</h3>
                        {testimonial.designation && (
                          <p className="text-sm text-slate-600">
                            {testimonial.designation}
                            {testimonial.company && ` at ${testimonial.company}`}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(testimonial)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(testimonial.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                </div>

                <p className="text-slate-700 mb-3 line-clamp-3">{testimonial.testimonial}</p>

                <div className="flex flex-wrap gap-2">
                  {testimonial.featured && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                      Featured
                    </span>
                  )}
                  {testimonial.type === 'video' && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded flex items-center gap-1">
                      <Video className="h-3 w-3" />
                      Video
                    </span>
                  )}
                  {project && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {project.name}
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs rounded ${
                    testimonial.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-slate-100 text-slate-800'
                  }`}>
                    {testimonial.status}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>

        {testimonials.length === 0 && (
          <Card className="p-12 text-center">
            <Quote className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl mb-2">No testimonials yet</h3>
            <p className="text-slate-600 mb-4">Add your first customer testimonial to build trust</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </Card>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
              </DialogTitle>
              <DialogDescription>
                {editingId ? 'Update customer testimonial details' : 'Add a new customer testimonial to build trust'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Customer Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="CEO, Business Owner, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Company Name"
                  />
                </div>

                <div>
                  <Label htmlFor="project">Project</Label>
                  <select
                    id="project"
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Select Project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label>Customer Photo</Label>
                <ImageUpload
                  value={formData.image || ''}
                  onChange={(value) => setFormData({ ...formData, image: value })}
                />
              </div>

              <div>
                <Label htmlFor="rating">Rating</Label>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                    >
                      <Star
                        className={`h-6 w-6 cursor-pointer ${
                          star <= (formData.rating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="type">Testimonial Type</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'text' | 'video' })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="text">Text Testimonial</option>
                  <option value="video">Video Testimonial</option>
                </select>
              </div>

              {formData.type === 'video' && (
                <div>
                  <Label htmlFor="videoUrl">Video URL</Label>
                  <Input
                    id="videoUrl"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="YouTube or Vimeo URL"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="testimonial">Testimonial Text *</Label>
                <Textarea
                  id="testimonial"
                  value={formData.testimonial}
                  onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                  placeholder="Share your experience with us..."
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="featured">Featured Testimonial</Label>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingId ? 'Update' : 'Add'} Testimonial
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}