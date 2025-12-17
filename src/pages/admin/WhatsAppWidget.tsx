import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { getData, setData } from '../../utils/localStorage';
import { toast } from 'sonner';
import { MessageSquare, Save } from 'lucide-react';

export function WhatsAppWidget() {
  const [settings, setSettings] = useState({
    enabled: true,
    phoneNumber: '',
    welcomeMessage: 'Hello! How can we help you today?',
    position: 'bottom-right',
    backgroundColor: '#25D366',
    buttonText: 'Chat with us',
    showOnPages: {
      home: true,
      projects: true,
      projectDetail: true,
      about: true,
      contact: true,
      gallery: true,
      blog: true
    },
    offlineMessage: 'We are currently offline. Please leave a message and we\'ll get back to you soon.',
    businessHours: {
      enabled: false,
      start: '09:00',
      end: '18:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    }
  });

  useEffect(() => {
    const loadSettings = async () => {
      const savedSettings = await getData('whatsappWidgetSettings');
      if (savedSettings && !Array.isArray(savedSettings)) {
        setSettings(savedSettings);
      }
    };
    loadSettings();
  }, []);

  const handleSave = () => {
    setData('whatsappWidgetSettings', settings);
    toast.success('WhatsApp Widget settings saved successfully!');
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2">WhatsApp Chat Widget</h1>
            <p className="text-slate-600">Configure floating WhatsApp chat button for your website</p>
          </div>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>

        {/* Basic Settings */}
        <Card className="p-6">
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Basic Settings
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable WhatsApp Widget</Label>
                <p className="text-sm text-slate-500">Show floating WhatsApp button on website</p>
              </div>
              <Switch
                checked={settings.enabled}
                onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber">WhatsApp Phone Number *</Label>
              <Input
                id="phoneNumber"
                value={settings.phoneNumber}
                onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                placeholder="+91 9876543210"
              />
              <p className="text-xs text-slate-500 mt-1">Include country code (e.g., +91 for India)</p>
            </div>

            <div>
              <Label htmlFor="welcomeMessage">Welcome Message</Label>
              <Textarea
                id="welcomeMessage"
                value={settings.welcomeMessage}
                onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
                placeholder="Hello! How can we help you today?"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={settings.buttonText}
                onChange={(e) => setSettings({ ...settings, buttonText: e.target.value })}
                placeholder="Chat with us"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="position">Position</Label>
                <select
                  id="position"
                  value={settings.position}
                  onChange={(e) => setSettings({ ...settings, position: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                </select>
              </div>

              <div>
                <Label htmlFor="backgroundColor">Button Color</Label>
                <Input
                  id="backgroundColor"
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Display Pages */}
        <Card className="p-6">
          <h2 className="text-xl mb-4">Show Widget On Pages</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(settings.showOnPages).map((page) => (
              <div key={page} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <Label className="capitalize">{page.replace(/([A-Z])/g, ' $1').trim()}</Label>
                <Switch
                  checked={settings.showOnPages[page as keyof typeof settings.showOnPages]}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    showOnPages: { ...settings.showOnPages, [page]: checked }
                  })}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Business Hours */}
        <Card className="p-6">
          <h2 className="text-xl mb-4">Business Hours (Optional)</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Business Hours</Label>
                <p className="text-sm text-slate-500">Show offline message outside business hours</p>
              </div>
              <Switch
                checked={settings.businessHours.enabled}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  businessHours: { ...settings.businessHours, enabled: checked }
                })}
              />
            </div>

            {settings.businessHours.enabled && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={settings.businessHours.start}
                      onChange={(e) => setSettings({
                        ...settings,
                        businessHours: { ...settings.businessHours, start: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={settings.businessHours.end}
                      onChange={(e) => setSettings({
                        ...settings,
                        businessHours: { ...settings.businessHours, end: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Working Days</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <div key={day} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={day}
                          checked={settings.businessHours.days.includes(day)}
                          onChange={(e) => {
                            const days = e.target.checked
                              ? [...settings.businessHours.days, day]
                              : settings.businessHours.days.filter(d => d !== day);
                            setSettings({
                              ...settings,
                              businessHours: { ...settings.businessHours, days }
                            });
                          }}
                          className="rounded"
                        />
                        <Label htmlFor={day} className="text-sm">{day.slice(0, 3)}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="offlineMessage">Offline Message</Label>
                  <Textarea
                    id="offlineMessage"
                    value={settings.offlineMessage}
                    onChange={(e) => setSettings({ ...settings, offlineMessage: e.target.value })}
                    rows={2}
                  />
                </div>
              </>
            )}
          </div>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg">
            <Save className="h-4 w-4 mr-2" />
            Save All Settings
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
