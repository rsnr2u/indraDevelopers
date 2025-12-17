import { useState, useEffect } from 'react';
import { Header } from '../../components/frontend/Header';
import { Footer } from '../../components/frontend/Footer';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { getData } from '../../utils/localStorage';
import { useTheme } from '../../contexts/ThemeContext';
import { Search, CheckCircle, Clock, Phone, Mail, MapPin, Calendar, FileText } from 'lucide-react';
import { toast } from 'sonner';

export function TrackLead() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [leadData, setLeadData] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getData('settings');
      setSettings(data);
    };
    fetchSettings();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter your phone number or email');
      return;
    }

    try {
      // In a real API, we would search via a query parameter e.g., /leads?query=...
      // For now, if we are fetching all leads (admin only usually), this might be restricted.
      // But 'leads' endpoint in our current API implementation fetches ALL leads.
      // This is not ideal for public facing "Track Lead", but sticking to the current pattern:
      const leads = await getData('leads') || [];

      const found = leads.find((lead: any) =>
        lead.phone === searchQuery ||
        lead.email === searchQuery ||
        lead.id === searchQuery ||
        lead.id === parseInt(searchQuery) // Handle numeric ID
      );

      if (found) {
        setLeadData(found);
        setNotFound(false);
      } else {
        setLeadData(null);
        setNotFound(true);
        toast.error('No enquiry found with the provided details');
      }
    } catch (error) {
      console.error('Error searching leads:', error);
      toast.error('Failed to search enquiries. Please try again.');
    }
  };

  const getStatusInfo = (status: string) => {
    const statusConfig: any = {
      'New': {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: Clock,
        message: 'We have received your enquiry and will contact you shortly.'
      },
      'Contacted': {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Phone,
        message: 'Our team has contacted you. Please check your phone or email.'
      },
      'Qualified': {
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: CheckCircle,
        message: 'Your enquiry has been qualified. We are preparing details for you.'
      },
      'Site Visit Scheduled': {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: Calendar,
        message: 'Your site visit has been scheduled. Details have been shared with you.'
      },
      'Converted': {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
        message: 'Congratulations! Your booking has been confirmed.'
      },
      'Lost': {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: Clock,
        message: 'This enquiry is currently on hold. Contact us if you are still interested.'
      }
    };

    return statusConfig[status] || statusConfig['New'];
  };

  const StatusIcon = leadData ? getStatusInfo(leadData.status).icon : Clock;
  const statusInfo = leadData ? getStatusInfo(leadData.status) : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <div className="flex-1">
        {/* Header */}
        <div
          className="text-white py-16"
          style={{
            background: `linear-gradient(135deg, ${colors.primaryColor} 0%, ${colors.secondaryColor} 100%)`
          }}
        >
          <div className="container">
            <h1 className="text-4xl md:text-5xl mb-4">Track Your Enquiry</h1>
            <p className="text-lg text-white/90">
              Enter your phone number or email to check your enquiry status
            </p>
          </div>
        </div>

        <div className="container py-12">
          <div className="max-w-2xl mx-auto">
            {/* Search Form */}
            <Card className="p-6 mb-8">
              <Label htmlFor="search" className="text-lg mb-2" style={{ color: colors.headingColor }}>
                Search Your Enquiry
              </Label>
              <p className="text-sm text-slate-600 mb-4">
                Enter the phone number or email you used when submitting the enquiry
              </p>
              <div className="flex gap-2">
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Phone number or email address"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button
                  onClick={handleSearch}
                  style={{ backgroundColor: colors.primaryColor }}
                  className="text-white"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </Card>

            {/* Lead Details */}
            {leadData && (
              <div className="space-y-6">
                {/* Status Card */}
                <Card className={`p-6 border-2 ${statusInfo.color}`}>
                  <div className="flex items-start gap-4">
                    <div
                      className="p-3 rounded-full"
                      style={{ backgroundColor: `${colors.primaryColor}15` }}
                    >
                      <StatusIcon className="h-6 w-6" style={{ color: colors.primaryColor }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-xl" style={{ color: colors.headingColor }}>
                          Status: {leadData.status}
                        </h2>
                      </div>
                      <p className="text-slate-700">{statusInfo.message}</p>
                      {leadData.nextFollowUp && (
                        <p className="text-sm text-slate-600 mt-2">
                          Next Follow-up: {new Date(leadData.nextFollowUp).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Details Card */}
                <Card className="p-6">
                  <h3 className="text-lg mb-4" style={{ color: colors.headingColor }}>
                    Enquiry Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-700">
                      <div className="w-8">
                        <FileText className="h-5 w-5" style={{ color: colors.primaryColor }} />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Reference Number</p>
                        <p className="font-medium">{leadData.id}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-slate-700">
                      <div className="w-8">
                        <Phone className="h-5 w-5" style={{ color: colors.primaryColor }} />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Phone Number</p>
                        <p className="font-medium">{leadData.phone}</p>
                      </div>
                    </div>

                    {leadData.email && (
                      <div className="flex items-center gap-3 text-slate-700">
                        <div className="w-8">
                          <Mail className="h-5 w-5" style={{ color: colors.primaryColor }} />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Email</p>
                          <p className="font-medium">{leadData.email}</p>
                        </div>
                      </div>
                    )}

                    {leadData.projectInterest && (
                      <div className="flex items-center gap-3 text-slate-700">
                        <div className="w-8">
                          <MapPin className="h-5 w-5" style={{ color: colors.primaryColor }} />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Project Interest</p>
                          <p className="font-medium">{leadData.projectInterest}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-slate-700">
                      <div className="w-8">
                        <Calendar className="h-5 w-5" style={{ color: colors.primaryColor }} />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Enquiry Date</p>
                        <p className="font-medium">
                          {new Date(leadData.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Notes */}
                {leadData.notes && leadData.notes.length > 0 && (
                  <Card className="p-6">
                    <h3 className="text-lg mb-4" style={{ color: colors.headingColor }}>
                      Updates & Notes
                    </h3>
                    <div className="space-y-3">
                      {leadData.notes.map((note: any, index: number) => (
                        <div key={index} className="border-l-2 pl-4 py-2" style={{ borderColor: colors.primaryColor }}>
                          <p className="text-sm text-slate-600">
                            {new Date(note.createdAt).toLocaleString()}
                          </p>
                          <p className="text-slate-800 mt-1">{note.note}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Contact Card */}
                <Card className="p-6 bg-slate-50">
                  <h3 className="text-lg mb-2" style={{ color: colors.headingColor }}>
                    Need Help?
                  </h3>
                  <p className="text-slate-600 mb-4">
                    If you have any questions about your enquiry, please contact us.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      style={{
                        borderColor: colors.primaryColor,
                        color: colors.primaryColor
                      }}
                      onClick={() => {
                        if (settings?.contact?.phone) {
                          window.location.href = `tel:${settings.contact.phone}`;
                        }
                      }}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Us
                    </Button>
                    <Button
                      style={{ backgroundColor: '#25D366' }}
                      className="text-white"
                      onClick={() => {
                        const whatsappNumber = settings?.contact?.phone?.replace(/[^0-9]/g, '') || '';
                        if (whatsappNumber) {
                          const message = `Hi, I'm tracking my enquiry (Ref: ${leadData.id}). I need assistance.`;
                          window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
                        }
                      }}
                    >
                      WhatsApp Us
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {/* Not Found */}
            {notFound && (
              <Card className="p-12 text-center">
                <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl mb-2" style={{ color: colors.headingColor }}>
                  No Enquiry Found
                </h3>
                <p className="text-slate-600 mb-6">
                  We couldn't find any enquiry matching your search. Please check the details and try again.
                </p>
                <p className="text-sm text-slate-500">
                  If you haven't submitted an enquiry yet, you can do so from any project page.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
