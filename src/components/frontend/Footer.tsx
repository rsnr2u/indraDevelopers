import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getData } from '../../utils/localStorage';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { useTheme } from '../../contexts/ThemeContext';

export function Footer() {
  const { colors } = useTheme();
  const [settings, setSettings] = useState<any>(null);
  const [contact, setContact] = useState<any>(null);
  const [menus, setMenus] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const websiteSettings = await getData('settings');
      if (websiteSettings && !Array.isArray(websiteSettings)) {
        // Handle potential nested 'settings' key
        const actualSettings = websiteSettings.settings || websiteSettings;
        setSettings(actualSettings);
      }

      const cmsPages = await getData('cmsPages');
      if (cmsPages && !Array.isArray(cmsPages)) {
        setContact(cmsPages.contact);
      }

      const menuData = await getData('menus');
      if (menuData && !Array.isArray(menuData)) {
        setMenus(menuData.footer || []);
      }
    };
    loadData();
  }, []);

  if (!settings) return null;

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white mt-auto">
      {/* Newsletter Section */}
      <div className="border-b border-slate-700">
        <div className="container py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl mb-2">Stay Updated</h3>
              <p className="text-slate-400">Get the latest updates on new projects and offers</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none text-white placeholder:text-slate-500 flex-1 md:w-80"
                style={{
                  borderColor: '#334155'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.primaryColor;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#334155';
                }}
              />
              <Button
                className="text-white px-6"
                style={{ backgroundColor: colors.primaryColor }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              {settings.website.footerLogo ? (
                <img src={settings.website.footerLogo} alt={settings.website.name} className="h-12 mb-4" />
              ) : (
                <h3 className="text-2xl mb-3">{settings.website.name}</h3>
              )}
            </div>
            <p className="text-slate-400 leading-relaxed mb-6">
              {settings.footer?.text || settings.website.slogan || 'Building dreams, creating landmarks. Your trusted partner in real estate development.'}
            </p>

            {/* Social Media */}
            <div className="flex items-center gap-3">
              {settings.social?.facebook && (
                <a
                  href={settings.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center transition-all hover:scale-110"
                  style={{ backgroundColor: '#1e293b' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryColor}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {settings.social?.twitter && (
                <a
                  href={settings.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center transition-all hover:scale-110"
                  style={{ backgroundColor: '#1e293b' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryColor}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {settings.social?.linkedin && (
                <a
                  href={settings.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center transition-all hover:scale-110"
                  style={{ backgroundColor: '#1e293b' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryColor}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {settings.social?.instagram && (
                <a
                  href={settings.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center transition-all hover:scale-110"
                  style={{ backgroundColor: '#1e293b' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryColor}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg mb-6 relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-12 h-0.5" style={{ backgroundColor: colors.primaryColor }}></span>
            </h4>
            <div className="flex flex-col gap-3">
              {menus.sort((a, b) => a.order - b.order).map((menu) => (
                <Link
                  key={menu.id}
                  to={menu.url}
                  className="text-slate-400 transition-colors flex items-center gap-2 group"
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                >
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  {menu.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg mb-6 relative inline-block">
              Our Services
              <span className="absolute bottom-0 left-0 w-12 h-0.5" style={{ backgroundColor: colors.primaryColor }}></span>
            </h4>
            <div className="flex flex-col gap-3">
              <Link
                to="/projects"
                className="text-slate-400 transition-colors flex items-center gap-2 group"
                onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
              >
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                Residential Plots
              </Link>
              <Link
                to="/projects"
                className="text-slate-400 transition-colors flex items-center gap-2 group"
                onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
              >
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                Commercial Spaces
              </Link>
              <Link
                to="/projects"
                className="text-slate-400 transition-colors flex items-center gap-2 group"
                onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
              >
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                Gated Communities
              </Link>
              <Link
                to="/contact"
                className="text-slate-400 transition-colors flex items-center gap-2 group"
                onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
              >
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                Consultation
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          {contact && (
            <div>
              <h4 className="text-lg mb-6 relative inline-block">
                Contact Us
                <span className="absolute bottom-0 left-0 w-12 h-0.5" style={{ backgroundColor: colors.primaryColor }}></span>
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-4 w-4" style={{ color: colors.primaryColor }} />
                  </div>
                  <div>
                    <p className="text-sm mb-1 text-slate-500">Our Location</p>
                    <p className="text-slate-300">{contact.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-4 w-4" style={{ color: colors.primaryColor }} />
                  </div>
                  <div>
                    <p className="text-sm mb-1 text-slate-500">Phone Number</p>
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-slate-300 transition-colors"
                      onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e1'}
                    >
                      {contact.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4" style={{ color: colors.primaryColor }} />
                  </div>
                  <div>
                    <p className="text-sm mb-1 text-slate-500">Email Address</p>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-slate-300 transition-colors"
                      onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e1'}
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              {settings.footer?.copyright || `© ${new Date().getFullYear()} ${settings.website.name}. All rights reserved.`}
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/privacy-policy" className="text-slate-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-slate-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/sitemap" className="text-slate-400 hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}