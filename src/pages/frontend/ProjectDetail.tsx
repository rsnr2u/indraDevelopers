import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getData, addItem } from '../../utils/localStorage';
import { Header } from '../../components/frontend/Header';
import { Footer } from '../../components/frontend/Footer';
import { Building2, MapPin, Phone, Mail, CheckCircle, ArrowLeft, MapPinned, Users, Send, Download, Share2, Facebook, Twitter, Linkedin, Link as LinkIcon, MessageCircle } from 'lucide-react';
import { ImageCarousel } from '../../components/ImageCarousel';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { useTheme } from '../../contexts/ThemeContext';
import { toast } from 'sonner';

export function ProjectDetail() {
  const { id } = useParams();
  const { colors } = useTheme();
  const [project, setProject] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [location, setLocation] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projects, categories, locations, websiteSettings] = await Promise.all([
          getData('projects'),
          getData('projectCategories'),
          getData('locations'),
          getData('settings')
        ]);

        const projectsList = projects || [];
        const foundProject = projectsList.find((p: any) => p.id === id);
        setProject(foundProject);

        if (foundProject) {
          const categoriesList = categories || [];
          setCategory(categoriesList.find((c: any) => c.id === foundProject.categoryId));

          const locationsList = locations || [];
          setLocation(locationsList.find((l: any) => l.id === foundProject.locationId));
        }

        setSettings(websiteSettings);
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    const leadData = {
      ...formData,
      projectInterest: project.name,
      source: 'Project Detail Page',
      status: 'New',
      createdAt: new Date().toISOString()
    };

    try {
      await addItem('leads', leadData);
      toast.success('Your enquiry has been submitted successfully!');

      // Redirect to WhatsApp with form information
      const whatsappNumber = settings?.contact?.phone?.replace(/[^0-9]/g, '') || '';
      const message = `Hi, I'm interested in ${project.name} project.\n\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email || 'Not provided'}\nMessage: ${formData.message || 'No additional message'}\n\nPlease share more details.`;

      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');

      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      setFormSubmitted(true);
    } catch (error) {
      console.error('Error submitting lead:', error);
      toast.error('Failed to submit enquiry. Please try again.');
    }
  };

  const handleWhatsApp = () => {
    const message = `Hi, I'm interested in ${project.name} project. Please share more details.`;
    const whatsappNumber = settings?.contact?.phone?.replace(/[^0-9]/g, '') || '';
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <Building2 className="h-24 w-24 text-slate-300 mx-auto mb-6" />
            <h2 className="text-3xl text-slate-900 mb-4">Project not found</h2>
            <p className="text-slate-600 mb-8">The project you're looking for doesn't exist.</p>
            <Link to="/projects">
              <Button style={{ backgroundColor: colors.primaryColor }}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <div className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-200">
          <div className="container py-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Link
                to="/"
                className="transition-colors"
                style={{ color: '#64748b' }}
                onMouseEnter={(e) => e.currentTarget.style.color = colors.primaryColor}
                onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
              >Home</Link>
              <span>/</span>
              <Link
                to="/projects"
                className="transition-colors"
                style={{ color: '#64748b' }}
                onMouseEnter={(e) => e.currentTarget.style.color = colors.primaryColor}
                onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
              >Projects</Link>
              <span>/</span>
              <span style={{ color: colors.textColor }}>{project.name}</span>
            </div>
          </div>
        </div>

        {/* Project Header */}
        <div
          className="text-white py-16"
          style={{
            background: `linear-gradient(135deg, ${colors.primaryColor} 0%, ${colors.secondaryColor} 100%)`
          }}
        >
          <div className="container">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Link>
            <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl mb-4">{project.name}</h1>
                <div className="flex flex-wrap gap-6 text-lg">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    <span>{category?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>{location?.name}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <a href={`tel:${settings?.contact?.phone}`}>
                  <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white" style={{ color: 'white' }}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                </a>
                <Button
                  size="lg"
                  className="bg-white hover:bg-white/90"
                  style={{ color: colors.primaryColor }}
                  onClick={() => document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Enquire Now
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Images Carousel */}
              {project.images && project.images.length > 0 && (
                <Card className="overflow-hidden border-slate-200 shadow-lg">
                  <div className="h-[500px]">
                    <ImageCarousel images={project.images} autoPlayInterval={5000}>
                      {(image, index) => (
                        <div className="h-[500px]">
                          <img
                            src={image}
                            alt={`${project.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </ImageCarousel>
                  </div>
                </Card>
              )}

              {/* Description */}
              <Card className="p-8 border-slate-200 shadow-lg">
                <h2
                  className="text-3xl mb-6"
                  style={{ color: colors.headingColor }}
                >
                  About This Project
                </h2>
                <div
                  className="prose prose-lg max-w-none prose-headings:text-slate-900"
                  style={{ color: colors.textColor }}
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              </Card>

              {/* Amenities */}
              {project.schema?.amenities && project.schema.amenities.length > 0 && (
                <Card className="p-8 border-slate-200 shadow-lg">
                  <h2
                    className="text-3xl mb-6"
                    style={{ color: colors.headingColor }}
                  >
                    Amenities & Features
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.schema.amenities.map((amenity: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg transition-all border border-transparent hover:shadow-md"
                        style={{ backgroundColor: `${colors.primaryColor}08` }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = colors.primaryColor;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'transparent';
                        }}
                      >
                        <div
                          className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${colors.primaryColor}15` }}
                        >
                          <CheckCircle className="h-5 w-5" style={{ color: colors.primaryColor }} />
                        </div>
                        <span style={{ color: colors.textColor }}>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Location Highlights */}
              <Card className="p-8 border-slate-200 shadow-lg">
                <h2
                  className="text-3xl mb-6"
                  style={{ color: colors.headingColor }}
                >
                  Location Advantages
                </h2>
                <div className="space-y-4">
                  <div
                    className="flex items-start gap-3 p-4 rounded-lg"
                    style={{ backgroundColor: `${colors.primaryColor}08` }}
                  >
                    <MapPinned className="h-6 w-6 flex-shrink-0 mt-1" style={{ color: colors.primaryColor }} />
                    <div>
                      <h4 className="mb-1" style={{ color: colors.headingColor }}>Prime Location</h4>
                      <p style={{ color: colors.textColor }}>Strategically located in {location?.name} with excellent connectivity to major hubs and IT corridors.</p>
                    </div>
                  </div>
                  <div
                    className="flex items-start gap-3 p-4 rounded-lg"
                    style={{ backgroundColor: `${colors.secondaryColor}08` }}
                  >
                    <Building2 className="h-6 w-6 flex-shrink-0 mt-1" style={{ color: colors.secondaryColor }} />
                    <div>
                      <h4 className="mb-1" style={{ color: colors.headingColor }}>Infrastructure</h4>
                      <p style={{ color: colors.textColor }}>Well-developed infrastructure with wide roads, drainage systems, and all essential utilities in place.</p>
                    </div>
                  </div>
                  <div
                    className="flex items-start gap-3 p-4 rounded-lg"
                    style={{ backgroundColor: `${colors.accentColor}08` }}
                  >
                    <Users className="h-6 w-6 flex-shrink-0 mt-1" style={{ color: colors.accentColor }} />
                    <div>
                      <h4 className="mb-1" style={{ color: colors.headingColor }}>Community Living</h4>
                      <p style={{ color: colors.textColor }}>Part of a thriving community with easy access to schools, hospitals, shopping centers, and recreational facilities.</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Why Invest */}
              <Card
                className="p-8 border-slate-200 shadow-lg"
                style={{ background: `linear-gradient(135deg, ${colors.primaryColor}08 0%, white 100%)` }}
              >
                <h2
                  className="text-3xl mb-6"
                  style={{ color: colors.headingColor }}
                >
                  Why Invest in {project.name}?
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      title: 'High Appreciation Potential',
                      desc: 'The area is experiencing rapid development, ensuring excellent long-term returns on investment.'
                    },
                    {
                      title: 'Clear Titles & Documentation',
                      desc: 'All plots come with clear titles and approved documentation, ensuring a hassle-free buying experience.'
                    },
                    {
                      title: 'Trusted Developer',
                      desc: 'Developed by Indra Developers, known for quality construction and timely delivery.'
                    },
                    {
                      title: 'Flexible Payment Plans',
                      desc: 'Easy payment options and flexible plans to make your dream property affordable.'
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div
                        className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 text-white"
                        style={{ backgroundColor: colors.primaryColor }}
                      >
                        <span>{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="mb-1" style={{ color: colors.headingColor }}>{item.title}</h4>
                        <p style={{ color: colors.textColor }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Share This Project */}
              <Card className="p-8 border-slate-200 shadow-lg">
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-gray-900 mb-4">
                    <Share2 className="h-5 w-5" style={{ color: colors.primaryColor }} />
                    <h3 className="text-lg font-medium" style={{ color: colors.headingColor }}>Share This Project</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">Help others discover this amazing project by sharing it on your favorite platform</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#1877F2] text-white rounded-lg hover:bg-[#1666d9] transition-all shadow-md hover:shadow-lg"
                  >
                    <Facebook className="h-4 w-4" />
                    <span className="text-sm font-medium">Facebook</span>
                  </a>

                  {/* Twitter */}
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(project.name + ' - ' + (category?.name || 'Real Estate Project'))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a8cd8] transition-all shadow-md hover:shadow-lg"
                  >
                    <Twitter className="h-4 w-4" />
                    <span className="text-sm font-medium">Twitter</span>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(project.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#0A66C2] text-white rounded-lg hover:bg-[#095196] transition-all shadow-md hover:shadow-lg"
                  >
                    <Linkedin className="h-4 w-4" />
                    <span className="text-sm font-medium">LinkedIn</span>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent('Check out this amazing project: ' + project.name + ' - ' + window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#25D366] text-white rounded-lg hover:bg-[#20bd5a] transition-all shadow-md hover:shadow-lg"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">WhatsApp</span>
                  </a>

                  {/* Copy Link */}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      const btn = document.getElementById('copy-project-link-btn');
                      if (btn) {
                        const originalText = btn.textContent;
                        btn.textContent = 'Copied!';
                        setTimeout(() => {
                          btn.textContent = originalText || 'Copy Link';
                        }, 2000);
                      }
                      toast.success('Link copied to clipboard!');
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
                  >
                    <LinkIcon className="h-4 w-4" />
                    <span id="copy-project-link-btn" className="text-sm font-medium">Copy Link</span>
                  </button>
                </div>
              </Card>
            </div>

            {/* Sidebar - Enquiry Form */}
            <div className="space-y-6">
              <Card className="p-6 border-slate-200 shadow-lg sticky top-24" id="enquiry-form">
                <h3
                  className="text-2xl mb-6"
                  style={{ color: colors.headingColor }}
                >
                  Request a Call Back
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label style={{ color: colors.textColor }}>Your Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div>
                    <Label style={{ color: colors.textColor }}>Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <Label style={{ color: colors.textColor }}>Phone Number *</Label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 XXXXX XXXXX"
                      required
                    />
                  </div>

                  <div>
                    <Label style={{ color: colors.textColor }}>Message</Label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your requirements..."
                      rows={4}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-white"
                    style={{ backgroundColor: colors.primaryColor }}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit Enquiry
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <div className="space-y-3">
                    {project.price && (
                      <div
                        className="p-4 rounded-lg"
                        style={{ backgroundColor: `${colors.primaryColor}10` }}
                      >
                        <p className="text-sm mb-1" style={{ color: colors.textColor }}>Price</p>
                        <p className="text-xl" style={{ color: colors.headingColor }}>{project.price}</p>
                      </div>
                    )}
                    {project.offerPrice && (
                      <div
                        className="p-4 rounded-lg"
                        style={{ backgroundColor: `${colors.accentColor}10` }}
                      >
                        <p className="text-sm mb-1" style={{ color: colors.textColor }}>Offer Price</p>
                        <p className="text-xl" style={{ color: colors.headingColor }}>{project.offerPrice}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Brochure Download - Shows after form submission */}
                {formSubmitted && project.brochure && (
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <div
                      className="p-4 rounded-lg text-center"
                      style={{ backgroundColor: `${colors.primaryColor}08` }}
                    >
                      <h4 className="mb-3" style={{ color: colors.headingColor }}>Download Project Brochure</h4>
                      <a
                        href={project.brochure}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          className="w-full text-white"
                          style={{ backgroundColor: colors.primaryColor }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Brochure
                        </Button>
                      </a>
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-slate-200">
                  {settings?.contact?.phone && (
                    <a href={`tel:${settings.contact.phone}`}>
                      <Button
                        variant="outline"
                        className="w-full transition-all"
                        style={{
                          borderColor: colors.primaryColor,
                          color: colors.primaryColor
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.primaryColor;
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = colors.primaryColor;
                        }}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        {settings.contact.phone}
                      </Button>
                    </a>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}