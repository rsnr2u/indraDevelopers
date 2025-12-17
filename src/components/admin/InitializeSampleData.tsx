import { useEffect, useState } from 'react';
import { getData, setData } from '../../utils/localStorage';
import { sampleBlogPosts, sampleBlogCategories } from '../../utils/sampleData';
import { Button } from '../ui/button';
import { toast } from 'sonner@2.0.3';
import { Download } from 'lucide-react';

export function InitializeSampleData() {
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const blogPosts = getData('blogPosts') || [];
    setHasData(blogPosts.length > 0);
  }, []);

  const loadSampleData = () => {
    try {
      // Load sample categories if none exist
      const existingCategories = getData('blogCategories') || [];
      if (existingCategories.length === 0) {
        setData('blogCategories', sampleBlogCategories);
      }

      // Load sample blog posts
      const existingPosts = getData('blogPosts') || [];
      const newPosts = [...existingPosts, ...sampleBlogPosts];
      setData('blogPosts', newPosts);

      toast.success('Sample blog posts loaded successfully!');
      setHasData(true);
      
      // Refresh the page to show new data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error('Failed to load sample data');
    }
  };

  if (hasData) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <Download className="h-5 w-5 text-blue-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-medium text-blue-900 mb-1">No blog posts yet</h3>
          <p className="text-sm text-blue-700 mb-3">
            Would you like to load sample blog posts with images to see how it looks?
          </p>
          <Button onClick={loadSampleData} size="sm" variant="outline">
            Load Sample Blog Posts
          </Button>
        </div>
      </div>
    </div>
  );
}
