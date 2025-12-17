import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getData, deleteItem } from '../../utils/localStorage';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner@2.0.3';
import { Plus, Trash2, Edit2, Image as ImageIcon } from 'lucide-react';

export function GalleryManagement() {
  const navigate = useNavigate();
  const [galleries, setGalleries] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const galleryData = getData('galleries') || [];
    setGalleries(galleryData);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery?')) return;

    deleteItem('galleries', id);
    loadData();
    toast.success('Gallery deleted successfully!');
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl">Gallery Management</h1>
            <p className="text-gray-600 mt-1">Manage gallery albums with titles, descriptions, and images</p>
          </div>
          <Button onClick={() => navigate('/admin/gallery/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Gallery Album
          </Button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery) => (
            <div key={gallery.id} className="bg-white rounded-lg border overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              {/* Gallery Images Preview */}
              <div className="relative h-48 bg-gray-100">
                {gallery.images && gallery.images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-1 h-full p-1">
                    {gallery.images.slice(0, 4).map((image: string, index: number) => (
                      <div key={index} className="relative overflow-hidden rounded">
                        <img
                          src={image}
                          alt={`${gallery.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {index === 3 && gallery.images.length > 4 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white text-xl">+{gallery.images.length - 4}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-sm font-medium">
                  {gallery.images?.length || 0} images
                </div>
              </div>

              {/* Gallery Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 line-clamp-1">{gallery.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {gallery.description || 'No description'}
                </p>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/admin/gallery/${gallery.id}`)}
                    className="flex-1"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(gallery.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {galleries.length === 0 && (
          <div className="bg-white rounded-lg border p-12 text-center">
            <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl text-gray-900 mb-2">No Gallery Albums Yet</h3>
            <p className="text-gray-600 mb-6">Create your first gallery album to showcase your images</p>
            <Button onClick={() => navigate('/admin/gallery/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Gallery
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
