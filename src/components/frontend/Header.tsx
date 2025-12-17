import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { getData } from '../../utils/localStorage';
import { Button } from '../ui/button';
import { useTheme } from '../../contexts/ThemeContext';

export function Header() {
  const location = useLocation();
  const { colors } = useTheme();
  const [settings, setSettings] = useState<any>(null);
  const [menus, setMenus] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const websiteSettings = await getData('settings');
      if (websiteSettings && !Array.isArray(websiteSettings)) {
        // Handle potential nested 'settings' key
        const actualSettings = websiteSettings.settings || websiteSettings;
        setSettings(actualSettings);
      }

      const menuData = await getData('menus');
      if (menuData && !Array.isArray(menuData)) {
        setMenus(menuData.header || []);
      }
    };

    loadSettings();

    // Listen for settings updates
    const handleSettingsUpdate = () => {
      loadSettings();
    };

    window.addEventListener('settingsUpdated', handleSettingsUpdate);

    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (url: string) => location.pathname === url;

  if (!settings) return null;

  const primaryColor = colors.primaryColor;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}>
      {/* Top Bar - Contact Info */}
      <div className="bg-slate-900 text-white">
        <div className="container">
          <div className="flex flex-col sm:flex-row justify-between items-center py-2 gap-2 text-sm">
            <div className="flex flex-wrap items-center gap-6">
              {settings.contact?.phone && (
                <a
                  href={`tel:${settings.contact.phone}`}
                  className="flex items-center gap-2 transition-colors"
                  style={{ color: 'white' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>{settings.contact.phone}</span>
                </a>
              )}
              {settings.contact?.email && (
                <a
                  href={`mailto:${settings.contact.email}`}
                  className="flex items-center gap-2 transition-colors"
                  style={{ color: 'white' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>{settings.contact.email}</span>
                </a>
              )}
            </div>
            <Link to="/admin/login">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-white hover:bg-slate-800"
                style={{ '--hover-color': primaryColor } as any}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.color = primaryColor}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.color = 'white'}
              >
                Admin Portal
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white backdrop-blur-sm">
        <div className="container">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              {settings.website.headerLogo ? (
                // If logo exists, show only logo image
                <img
                  src={settings.website.headerLogo}
                  alt={settings.website.name}
                  className="h-12 transition-transform group-hover:scale-105"
                />
              ) : (
                // If no logo, show text and slogan
                <div>
                  <h1
                    className="text-2xl text-slate-900 transition-colors"
                    style={{ '--hover-color': primaryColor } as any}
                    onMouseEnter={(e: React.MouseEvent<HTMLHeadingElement>) => e.currentTarget.style.color = primaryColor}
                    onMouseLeave={(e: React.MouseEvent<HTMLHeadingElement>) => e.currentTarget.style.color = '#0f172a'}
                  >
                    {settings.website.name}
                  </h1>
                  {settings.website.slogan && (
                    <p className="text-xs text-slate-600">{settings.website.slogan}</p>
                  )}
                </div>
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {menus.sort((a, b) => a.order - b.order).map((menu) => (
                <Link
                  key={menu.id}
                  to={menu.url}
                  className="px-3 py-2 transition-colors text-slate-700"
                  style={isActive(menu.url) ? { color: primaryColor } : {}}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => !isActive(menu.url) && (e.currentTarget.style.color = primaryColor)}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => !isActive(menu.url) && (e.currentTarget.style.color = '#334155')}
                >
                  {menu.label}
                </Link>
              ))}
              <Link to="/contact" className="ml-2">
                <Button
                  className="text-white shadow-md"
                  style={{ backgroundColor: primaryColor }}
                  onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.opacity = '1'}
                >
                  Get Quote
                </Button>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2.5 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="lg:hidden pb-4 border-t border-slate-200 animate-in slide-in-from-top">
              <div className="flex flex-col gap-2 pt-4">
                {menus.sort((a, b) => a.order - b.order).map((menu) => (
                  <Link
                    key={menu.id}
                    to={menu.url}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg transition-colors ${isActive(menu.url)
                      ? 'text-white'
                      : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    style={isActive(menu.url) ? { backgroundColor: primaryColor } : {}}
                  >
                    {menu.label}
                  </Link>
                ))}
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    className="w-full text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Get Quote
                  </Button>
                </Link>
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}