import { useState, useEffect } from 'react';
import { X, Download, Phone, Mail } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { getData, addItem } from '../../utils/localStorage';
import { toast } from 'sonner@2.0.3';
import { useTheme } from '../../contexts/ThemeContext';

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const { colors } = useTheme();

  useEffect(() => {
    const popupSettings = getData('exitIntentSettings');
    if (popupSettings && popupSettings.enabled) {
      setSettings(popupSettings);
      
      // Check if already shown in this session
      const shownInSession = sessionStorage.getItem('exitIntentShown');
      if (shownInSession) {
        setHasShown(true);
        return;
      }

      // Track mouse movement for exit intent
      let exitIntentTriggered = false;
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0 && !exitIntentTriggered && !hasShown) {
          exitIntentTriggered = true;
          setTimeout(() => {
            setIsVisible(true);
            setHasShown(true);
            sessionStorage.setItem('exitIntentShown', 'true');
          }, 200);
        }
      };

      document.addEventListener('mouseleave', handleMouseLeave);
      return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }
  }, [hasShown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast.error('Please fill in required fields');
      return;
    }

    const leadData = {
      ...formData,
      source: 'Exit Intent Popup',
      status: 'New',
      createdAt: new Date().toISOString()
    };

    addItem('leads', leadData);
    toast.success('Thank you! We will contact you soon.');
    setIsVisible(false);

    // Redirect to WhatsApp if enabled
    if (settings.redirectToWhatsApp) {
      const websiteSettings = getData('settings');
      const whatsappNumber = websiteSettings?.contact?.phone?.replace(/[^0-9]/g, '') || '';
      if (whatsappNumber) {
        const message = `Hi, I'm interested in your projects. My name is ${formData.name}. Please share more details.`;
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
      }
    }
  };

  if (!isVisible || !settings) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div 
          className="p-6 rounded-t-xl text-white relative overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${colors.primaryColor} 0%, ${colors.secondaryColor} 100%)`
          }}
        >
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="relative z-10">
            <h2 className="text-2xl mb-2">{settings.title || "Wait! Don't Miss Out"}</h2>
            <p className="text-white/90 text-sm">
              {settings.description || "Get exclusive access to our latest projects and special offers"}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="popup-name">Your Name *</Label>
              <Input
                id="popup-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <Label htmlFor="popup-phone">Phone Number *</Label>
              <Input
                id="popup-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
                required
              />
            </div>

            <div>
              <Label htmlFor="popup-email">Email (Optional)</Label>
              <Input
                id="popup-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full text-white"
              style={{ backgroundColor: colors.primaryColor }}
            >
              {settings.ctaText || "Get Instant Access"}
            </Button>
          </form>

          {settings.showBenefits && (
            <div className="mt-6 space-y-2 text-sm">
              <p className="font-medium text-slate-900">You'll Get:</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-slate-600">
                  <Download className="h-4 w-4" style={{ color: colors.primaryColor }} />
                  <span>Exclusive project brochures</span>
                </li>
                <li className="flex items-center gap-2 text-slate-600">
                  <Phone className="h-4 w-4" style={{ color: colors.primaryColor }} />
                  <span>Priority site visit booking</span>
                </li>
                <li className="flex items-center gap-2 text-slate-600">
                  <Mail className="h-4 w-4" style={{ color: colors.primaryColor }} />
                  <span>Early bird special offers</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
