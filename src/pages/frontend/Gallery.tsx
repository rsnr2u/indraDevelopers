import { useEffect, useState } from 'react';
import { getData } from '../../utils/localStorage';
import { Header } from '../../components/frontend/Header';
import { Footer } from '../../components/frontend/Footer';
import { Dialog, DialogContent, DialogDescription } from '../../components/ui/dialog';
import { Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../../components/ui/button';

export function Gallery() {
  const [galleries, setGalleries] = useState<any[]>([]);
  const [selectedGallery, setSelectedGallery] = useState<any>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [pageData, setPageData] = useState<any>(null);
  const { colors } = useTheme();

  useEffect(() => {
    const loadData = async () => {
      const galleryData = await getData('galleries') || [];
      const cmsPages = await getData('cmsPages');

      setGalleries(galleryData);
      if (cmsPages?.gallery) {
        setPageData(cmsPages.gallery);
      }
    };
    loadData();
  }, []);

  const openGallery = (gallery: any, imageIndex: number = 0) => {
    setSelectedGallery(gallery);
    setSelectedImageIndex(imageIndex);
  };

  const closeGallery = () => {
    setSelectedGallery(null);
    setSelectedImageIndex(0);
  };

  const nextImage = () => {
    if (selectedGallery) {
      setSelectedImageIndex((prev) =>
        prev === selectedGallery.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedGallery) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? selectedGallery.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1">
        {/* Page Header */}
        <div
          className="text-white py-16"
          style={{ background: `linear-gradient(135deg, ${colors.primaryColor} 0%, ${colors.secondaryColor} 100%)` }}
        >
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl mb-4">Our Gallery</h1>
            <p className="text-xl text-white/90">Explore our collection of project images and achievements</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {galleries.length > 0 ? (
            <div className="space-y-12">
              {galleries.map((gallery) => (
                <div key={gallery.id} className="bg-white rounded-lg shadow-lg overflow-hidden border">
                  {/* Gallery Header */}
                  <div
                    className="p-6 border-b"
                    style={{ backgroundColor: `${colors.primaryColor}08` }}
                  >
                    <h2
                      className="text-2xl md:text-3xl mb-2"
                      style={{ color: colors.headingColor }}
                    >
                      {gallery.title}
                    </h2>
                    {gallery.description && (
                      <p
                        className="text-lg"
                        style={{ color: colors.textColor }}
                      >
                        {gallery.description}
                      </p>
                    )}
                    <p className="text-sm mt-2" style={{ color: colors.textColor }}>
                      {gallery.images?.length || 0} images
                    </p>
                  </div>

                  {/* Gallery Images Grid */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {gallery.images?.map((image: string, index: number) => (
                        <div
                          key={index}
                          className="cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all group relative aspect-video"
                          onClick={() => openGallery(gallery, index)}
                        >
                          <img
                            src={image}
                            alt={`${gallery.title} ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity"
                            style={{ backgroundColor: colors.primaryColor }}
                          />
                          <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                            {index + 1}/{gallery.images.length}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-lg">
              <ImageIcon
                className="h-20 w-20 mx-auto mb-4 opacity-30"
                style={{ color: colors.primaryColor }}
              />
              <h3
                className="text-2xl mb-2"
                style={{ color: colors.headingColor }}
              >
                No Gallery Albums Yet
              </h3>
              <p style={{ color: colors.textColor }}>
                Check back soon for our project galleries
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Dialog with Navigation */}
      <Dialog open={selectedGallery !== null} onOpenChange={closeGallery}>
        <DialogContent className="max-w-5xl p-0">
          <DialogDescription className="sr-only">
            Gallery image preview with navigation
          </DialogDescription>
          {selectedGallery && selectedGallery.images[selectedImageIndex] && (
            <div className="relative">
              {/* Image */}
              <div className="relative bg-black">
                <img
                  src={selectedGallery.images[selectedImageIndex]}
                  alt={`${selectedGallery.title} ${selectedImageIndex + 1}`}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              </div>

              {/* Navigation Buttons */}
              {selectedGallery.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                    style={{ zIndex: 10 }}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                    style={{ zIndex: 10 }}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <h3 className="text-xl mb-1">{selectedGallery.title}</h3>
                <p className="text-sm text-white/80">
                  Image {selectedImageIndex + 1} of {selectedGallery.images.length}
                </p>
              </div>

              {/* Thumbnail Strip */}
              {selectedGallery.images.length > 1 && (
                <div className="absolute bottom-20 left-0 right-0 px-6">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {selectedGallery.images.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all ${index === selectedImageIndex
                            ? 'border-white scale-110'
                            : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
