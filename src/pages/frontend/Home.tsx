import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getData } from '../../utils/localStorage';
import { Header } from '../../components/frontend/Header';
import { Footer } from '../../components/frontend/Footer';
import { WhatsAppWidget } from '../../components/frontend/WhatsAppWidget';
import { ExitIntentPopup } from '../../components/frontend/ExitIntentPopup';
import { TestimonialsSection } from '../../components/frontend/TestimonialsSection';
import { Button } from '../../components/ui/button';
import { Building2, MapPin, CheckCircle, Award, Users, TrendingUp, Home as HomeIcon, Calendar, Trophy, Star, Heart, Check } from 'lucide-react';
import { BannerCarousel } from '../../components/BannerCarousel';
import { useTheme } from '../../contexts/ThemeContext';

// Icon mapping
const iconMap: any = {
  building: Building2,
  users: Users,
  calendar: Calendar,
  trophy: Trophy,
  star: Star,
  heart: Heart,
  check: Check,
  award: Award
};

export function Home() {
  const { colors } = useTheme();
  const [homeData, setHomeData] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const cmsPages = await getData('cmsPages');
        // Handle if cmsPages is [] or null
        const homeContent = (cmsPages && !Array.isArray(cmsPages)) ? cmsPages.home : {};
        setHomeData(homeContent);

        const projectsData = await getData('projects');
        const activeProjects = (projectsData || []).filter((p: any) => p.status === 'Active').slice(0, 6);
        setProjects(activeProjects);
      } catch (error) {
        console.error('Error loading home data:', error);
        setHomeData({}); // Fallback to empty object to allow rendering
      }
    };
    fetchHomeData();
  }, []);

  // if (!homeData) return null; // Removed to allow rendering with defaults

  const banners = homeData?.banners || [];
  const stats = homeData?.stats || [];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    arrows: true,
    pauseOnHover: false
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Banner Carousel */}
      <section className="relative">
        {banners.length > 0 ? (
          <BannerCarousel banners={banners} />
        ) : (
          <div className="relative h-[600px] md:h-[700px]" style={{ background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})` }}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/4 -left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>
            <div className="container h-full flex items-center relative z-10">
              <div className="max-w-3xl">
                <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
                  <span className="text-white/90 text-sm">Premium Real Estate Development</span>
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight">
                  Welcome to Indra Developers
                </h1>
                <p className="text-xl md:text-2xl mb-10 text-white/90 leading-relaxed">
                  Building Dreams, Creating Landmarks
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/projects">
                    <Button size="lg" className="bg-white shadow-2xl px-8 py-6 h-auto" style={{ color: colors.primaryColor }}>
                      Explore Properties
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-8 py-6 h-auto">
                      Get in Touch
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Dynamic Statistics Section */}
      {stats.length > 0 && (
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat: any, index: number) => {
                const IconComponent = iconMap[stat.icon] || Building2;
                const colorIndex = index % 4;
                const bgColor = colorIndex === 0 ? colors.primaryColor :
                  colorIndex === 1 ? colors.accentColor :
                    colorIndex === 2 ? colors.secondaryColor :
                      colors.primaryColor;

                return (
                  <div key={stat.id || index} className="text-center">
                    <div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                      style={{ backgroundColor: `${bgColor}20` }}
                    >
                      <IconComponent className="h-8 w-8" style={{ color: bgColor }} />
                    </div>
                    <div className="text-4xl mb-2" style={{ color: colors.textColor }}>
                      {stat.value}
                    </div>
                    <div className="text-slate-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Featured Projects */}
      {projects.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-4xl mb-4" style={{ color: colors.textColor }}>
                Featured Projects
              </h2>
              <p className="text-xl text-slate-600">
                Explore our premium real estate developments
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative h-64 overflow-hidden">
                    {project.featuredImage ? (
                      <img
                        src={project.featuredImage}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})` }}
                      >
                        <Building2 className="h-20 w-20 text-white opacity-50" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <span
                        className="px-4 py-2 rounded-full text-sm text-white backdrop-blur-sm"
                        style={{ backgroundColor: `${colors.primaryColor}cc` }}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl mb-3 group-hover:underline" style={{ color: colors.textColor }}>
                      {project.name}
                    </h3>

                    {project.location && (
                      <div className="flex items-center gap-2 text-slate-600 mb-4">
                        <MapPin className="h-4 w-4" />
                        <span>{project.location}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-slate-600">
                        {project.totalPlots ? `${project.totalPlots} Plots` : 'View Details'}
                      </span>
                      <span
                        className="font-medium"
                        style={{ color: colors.primaryColor }}
                      >
                        Explore →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/projects">
                <Button
                  size="lg"
                  className="text-white px-8"
                  style={{ backgroundColor: colors.primaryColor }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  View All Projects
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4" style={{ color: colors.textColor }}>
              Why Choose Us
            </h2>
            <p className="text-xl text-slate-600">
              Your trusted partner in real estate development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Building2, title: 'Premium Locations', description: 'Strategically located properties in prime areas' },
              { icon: CheckCircle, title: 'Quality Construction', description: 'High-quality materials and expert craftsmanship' },
              { icon: Award, title: 'Award Winning', description: 'Recognized for excellence in real estate' },
              { icon: Users, title: 'Customer Focused', description: 'Dedicated support throughout your journey' }
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl hover:shadow-lg transition-all duration-300 group cursor-pointer"
                style={{
                  border: `2px solid transparent`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colors.primaryColor;
                  e.currentTarget.style.backgroundColor = `${colors.primaryColor}05`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${colors.primaryColor}15` }}
                >
                  <feature.icon className="h-8 w-8" style={{ color: colors.primaryColor }} />
                </div>
                <h3 className="text-xl mb-3" style={{ color: colors.textColor }}>
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4" style={{ color: colors.textColor }}>
              What Our Clients Say
            </h2>
            <p className="text-xl text-slate-600">
              Real stories from satisfied customers
            </p>
          </div>

          <TestimonialsSection />
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})` }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl mb-6">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-xl mb-10 text-white/90">
              Get in touch with us today and let our experts guide you to the perfect investment
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <Button size="lg" className="bg-white text-black hover:bg-slate-100 px-8 py-6 h-auto">
                  Contact Us Now
                </Button>
              </Link>
              <Link to="/projects">
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-8 py-6 h-auto">
                  Browse Properties
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppWidget />
      <ExitIntentPopup />
    </div>
  );
}