import { useEffect, useState } from 'react';
import { getData } from '../../utils/localStorage';
import { useTheme } from '../../contexts/ThemeContext';
import { Star, Quote } from 'lucide-react';
import { Card } from '../ui/card';

export function TestimonialsSection() {
  const { colors } = useTheme();
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    const allTestimonials = getData('testimonials') || [];
    // Get only active and featured testimonials
    const activeTestimonials = allTestimonials.filter(
      (t: any) => t.status === 'Active' && t.featured
    );
    setTestimonials(activeTestimonials);
  }, []);

  if (testimonials.length === 0) {
    return null;
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
      />
    ));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {testimonials.map((testimonial) => (
        <Card key={testimonial.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="mb-4">
            <Quote className="h-8 w-8 text-slate-300" />
          </div>

          <div className="flex items-center gap-1 mb-4">
            {renderStars(testimonial.rating)}
          </div>

          <p className="text-slate-700 mb-6 italic">"{testimonial.testimonial}"</p>

          <div className="flex items-center gap-4 pt-4 border-t">
            {testimonial.image ? (
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: colors.primaryColor }}
              >
                {testimonial.name.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-medium" style={{ color: colors.headingColor }}>
                {testimonial.name}
              </p>
              {testimonial.designation && (
                <p className="text-sm text-slate-600">
                  {testimonial.designation}
                  {testimonial.company && ` at ${testimonial.company}`}
                </p>
              )}
            </div>
          </div>

          {testimonial.type === 'video' && testimonial.videoUrl && (
            <div className="mt-4">
              <a
                href={testimonial.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                Watch Video Testimonial →
              </a>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
