import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getData, setData, addItem } from '../../utils/localStorage';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner@2.0.3';
import { ImageUpload } from '../../components/ImageUpload';
import { X, Plus, ArrowLeft } from 'lucide-react';

export function GalleryForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [] as string[]
  });
  const [newImage, setNewImage] = useState('');

  useEffect(() => {
    if (isEdit) {
      const galleries = getData('galleries') || [];
      const gallery = galleries.find((g: any) => g.id === id);
      if (gallery) {
        setFormData({
          title: gallery.title,
          description: gallery.description,
          images: gallery.images || []
        });
      }
    }
  }, [id, isEdit]);

  const addImageToGallery = () => {
    if (!newImage.trim()) {
      toast.error('Please enter an image URL');
      return;
    }

    setFormData({
      ...formData,
      images: [...formData.images, newImage]
    });
    setNewImage('');
    toast.success('Image added to gallery');
  };

  const removeImage = (index: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: updatedImages
    });
    toast.success('Image removed');
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (formData.images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    if (isEdit) {
      // Update existing gallery
      const allGalleries = getData('galleries') || [];
      const updated = allGalleries.map((g: any) =>
        g.id === id ? { ...g, ...formData } : g
      );
      setData('galleries', updated);
      toast.success('Gallery updated successfully!');
    } else {
      // Create new gallery
      addItem('galleries', formData);
      toast.success('Gallery created successfully!');
    }

    navigate('/admin/gallery');
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/gallery')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Gallery
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl">
              {isEdit ? 'Edit Gallery Album' : 'Create New Gallery Album'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEdit ? 'Update your gallery album details' : 'Add a new gallery album with title, description, and images'}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg border p-6 space-y-6">
          {/* Title */}
          <div>
            <Label>Album Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Project Completion Photos, Site Visit 2024"
              className="mt-1"
            />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of this gallery album"
              rows={3}
              className="mt-1"
            />
          </div>

          {/* Images Section */}
          <div className="border-t pt-6">
            <Label className="text-lg">Gallery Images *</Label>
            <p className="text-sm text-gray-600 mt-1 mb-4">
              Add multiple images to this gallery album
            </p>

            {/* Add Image Input */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <Label className="text-sm">Add New Image</Label>
              <div className="flex gap-2 mt-2">
                <div className="flex-1">
                  <ImageUpload
                    label=""
                    value={newImage}
                    onChange={setNewImage}
                  />
                </div>
                <Button type="button" onClick={addImageToGallery} className="mt-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              </div>
            </div>

            {/* Images Grid */}
            {formData.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors">
                      <img
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                      Image {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <Plus className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-900 font-medium mb-1">No images added yet</p>
                  <p className="text-sm text-gray-600">Use the form above to add images to your gallery</p>
                </div>
              </div>
            )}

            {formData.images.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>{formData.images.length}</strong> image{formData.images.length !== 1 ? 's' : ''} added to this gallery
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end bg-white rounded-lg border p-4">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/gallery')}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} className="min-w-[120px]">
            {isEdit ? 'Update Gallery' : 'Create Gallery'}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
