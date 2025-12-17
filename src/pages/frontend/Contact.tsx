import { useEffect, useState } from 'react';
import { getData, addItem } from '../../utils/localStorage';
import { Header } from '../../components/frontend/Header';
import { Footer } from '../../components/frontend/Footer';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Clock, Send, Building2, MessageSquare } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function Contact() {
  const { colors } = useTheme();
  const [contactData, setContactData] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectInterest: '',
    message: ''
  });

  useEffect(() => {
    const loadData = async () => {
      const cmsPages = await getData('cmsPages');
      if (cmsPages?.contact) {
        setContactData(cmsPages.contact);
      }
      const projectsData = await getData('projects');
      setProjects(projectsData || []);
    };
    loadData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    addItem('leads', {
      ...formData,
      status: 'New',
      source: 'Website'
    });

    toast.success('Thank you! We will contact you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      projectInterest: '',
      message: ''
    });
  };

  if (!contactData) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <div className="flex-1">
        {/* Page Header */}
        <div
          className="text-white py-20 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})` }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-5xl mb-4">{contactData.title}</h1>
              <p className="text-xl text-white/90">
                We'd love to hear from you. Get in touch with us today!
              </p>
            </div>
          </div>
        </div>

        {/* Quick Contact Cards */}
        <div className="container mx-auto px-4 -mt-12 relative z-20 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div
                className="h-12 w-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: `${colors.primaryColor}15` }}
              >
                <MapPin className="h-6 w-6" style={{ color: colors.primaryColor }} />
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: colors.textColor }}>Visit Us</h3>
              <p className="text-sm text-gray-600">{contactData.address}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div
                className="h-12 w-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: `${colors.primaryColor}15` }}
              >
                <Phone className="h-6 w-6" style={{ color: colors.primaryColor }} />
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: colors.textColor }}>Call Us</h3>
              <a href={`tel:${contactData.phone}`} className="text-sm text-gray-600 hover:underline">
                {contactData.phone}
              </a>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div
                className="h-12 w-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: `${colors.primaryColor}15` }}
              >
                <Mail className="h-6 w-6" style={{ color: colors.primaryColor }} />
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: colors.textColor }}>Email Us</h3>
              <a href={`mailto:${contactData.email}`} className="text-sm text-gray-600 hover:underline break-all">
                {contactData.email}
              </a>
            </div>

            {contactData.workingHours && (
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div
                  className="h-12 w-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${colors.primaryColor}15` }}
                >
                  <Clock className="h-6 w-6" style={{ color: colors.primaryColor }} />
                </div>
                <h3 className="text-lg font-medium mb-2" style={{ color: colors.textColor }}>Working Hours</h3>
                <p className="text-sm text-gray-600">{contactData.workingHours}</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Contact Form - Takes 2 columns */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="h-12 w-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${colors.primaryColor}15` }}
                  >
                    <MessageSquare className="h-6 w-6" style={{ color: colors.primaryColor }} />
                  </div>
                  <div>
                    <h2 className="text-3xl" style={{ color: colors.textColor }}>Send us a Message</h2>
                    <p className="text-gray-600">Fill out the form and we'll get back to you shortly</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-base mb-2">Full Name *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="h-12"
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-base mb-2">Phone Number *</Label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="h-12"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-base mb-2">Email Address *</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="h-12"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-base mb-2">Project Interest</Label>
                    <select
                      value={formData.projectInterest}
                      onChange={(e) => setFormData({ ...formData, projectInterest: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 h-12 focus:outline-none focus:ring-2 focus:ring-offset-2"
                      style={{
                        '--tw-ring-color': colors.primaryColor,
                      } as React.CSSProperties}
                    >
                      <option value="">Select a project (optional)</option>
                      {projects
                        .filter((p: any) => p.status === 'Active')
                        .map((project: any) => (
                          <option key={project.id} value={project.name}>
                            {project.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <Label className="text-base mb-2">Your Message</Label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your requirements..."
                      rows={6}
                      className="resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-white text-base gap-2"
                    style={{ backgroundColor: colors.primaryColor }}
                    onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.opacity = '1'}
                  >
                    <Send className="h-5 w-5" />
                    Send Message
                  </Button>
                </form>
              </div>
            </div>

            {/* Additional Info Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Why Contact Us Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div
                  className="h-12 w-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${colors.primaryColor}15` }}
                >
                  <Building2 className="h-6 w-6" style={{ color: colors.primaryColor }} />
                </div>
                <h3 className="text-xl font-medium mb-3" style={{ color: colors.textColor }}>
                  Why Choose Us?
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Expert team with years of experience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Prime locations across the city</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Transparent pricing and documentation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>24/7 customer support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Flexible payment plans</span>
                  </li>
                </ul>
              </div>

              {/* CTA Card */}
              <div
                className="rounded-2xl shadow-xl p-6 text-white"
                style={{ background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})` }}
              >
                <h3 className="text-xl font-medium mb-3">
                  Schedule a Site Visit
                </h3>
                <p className="text-white/90 text-sm mb-4">
                  Experience our projects firsthand. Book a free site visit today!
                </p>
                <a
                  href={`tel:${contactData.phone}`}
                  className="block w-full bg-white text-center py-3 rounded-lg font-medium hover:shadow-lg transition-shadow"
                  style={{ color: colors.primaryColor }}
                >
                  Call Now
                </a>
              </div>
            </div>
          </div>

          {/* Map Section */}
          {contactData.mapEmbedUrl && (
            <div className="max-w-7xl mx-auto mt-12">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="text-2xl font-medium" style={{ color: colors.textColor }}>
                    Our Location
                  </h3>
                  <p className="text-gray-600 mt-1">Visit our office for more information</p>
                </div>
                <iframe
                  src={contactData.mapEmbedUrl}
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
