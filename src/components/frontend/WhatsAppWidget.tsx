import { useState, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { getData } from '../../utils/localStorage';

export function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [isBusinessHours, setIsBusinessHours] = useState(true);

  useEffect(() => {
    const widgetSettings = getData('whatsappWidgetSettings');
    if (widgetSettings) {
      setSettings(widgetSettings);
      checkBusinessHours(widgetSettings);
    }
  }, []);

  const checkBusinessHours = (settings: any) => {
    if (!settings.businessHours.enabled) {
      setIsBusinessHours(true);
      return;
    }

    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHours, startMinutes] = settings.businessHours.start.split(':').map(Number);
    const [endHours, endMinutes] = settings.businessHours.end.split(':').map(Number);
    const startTime = startHours * 60 + startMinutes;
    const endTime = endHours * 60 + endMinutes;

    const isDayIncluded = settings.businessHours.days.includes(currentDay);
    const isTimeInRange = currentTime >= startTime && currentTime <= endTime;

    setIsBusinessHours(isDayIncluded && isTimeInRange);
  };

  if (!settings || !settings.enabled || !settings.phoneNumber) {
    return null;
  }

  const currentPage = window.location.pathname;
  const pageKey = currentPage === '/' ? 'home' :
                  currentPage.startsWith('/projects/') ? 'projectDetail' :
                  currentPage.includes('/projects') ? 'projects' :
                  currentPage.includes('/about') ? 'about' :
                  currentPage.includes('/contact') ? 'contact' :
                  currentPage.includes('/gallery') ? 'gallery' :
                  currentPage.includes('/blog') ? 'blog' : null;

  if (pageKey && !settings.showOnPages[pageKey]) {
    return null;
  }

  const handleClick = () => {
    const message = isBusinessHours ? settings.welcomeMessage : settings.offlineMessage;
    const phoneNumber = settings.phoneNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const positionClasses = settings.position === 'bottom-left' 
    ? 'bottom-6 left-6' 
    : 'bottom-6 right-6';

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleClick}
        className={`fixed ${positionClasses} z-50 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 flex items-center justify-center group`}
        style={{ 
          backgroundColor: settings.backgroundColor,
          width: '60px',
          height: '60px'
        }}
        aria-label="Chat on WhatsApp"
      >
        <MessageSquare className="h-7 w-7 text-white" />
        
        {/* Tooltip */}
        <div className="absolute bottom-full mb-2 hidden group-hover:block whitespace-nowrap">
          <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-sm">
            {settings.buttonText}
          </div>
        </div>

        {/* Pulse Animation */}
        <span 
          className="absolute inset-0 rounded-full animate-ping opacity-75"
          style={{ backgroundColor: settings.backgroundColor }}
        />
      </button>
    </>
  );
}
