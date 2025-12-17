import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getData, setData } from '../../utils/localStorage';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';
import { ImageUpload } from '../../components/ImageUpload';
import { Switch } from '../../components/ui/switch';
import { Plus, Trash2 } from 'lucide-react';

export function Settings() {
  const [activeSection, setActiveSection] = useState('website');
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const loadSettings = async () => {
      const data = await getData('settings');
      if (data) {
        const actualSettings = data.settings || data;
        // Initialize contact field if it doesn't exist
        if (!actualSettings.contact) {
          actualSettings.contact = {
            phone: '+91 1234567890',
            email: 'info@indradevelopers.com',
            address: '123 Main Street, City, State - 500001'
          };
        }
        setSettings(actualSettings);
      }
    };
    loadSettings();
  }, []);

  const handleSave = () => {
    setData('settings', settings);
    // Dispatch custom event to notify theme changes
    window.dispatchEvent(new Event('settingsUpdated'));
    toast.success('Settings saved successfully!');
  };

  const updateSection = (section: string, field: string, value: any) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value
      }
    });
  };

  if (!settings) return <AdminLayout><div>Loading...</div></AdminLayout>;

  const sections = [
    { id: 'website', label: 'Website Settings' },
    { id: 'contact', label: 'Contact Information' },
    { id: 'footer', label: 'Footer Information' },
    { id: 'social', label: 'Social Media' },
    { id: 'mail', label: 'Mail Configuration' },
    { id: 'security', label: 'Security' },
    { id: 'theme', label: 'Theme Colors' }
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl mb-6">Settings</h1>

        <div className="flex gap-6">
          {/* Side Menu */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border p-4 space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-2 rounded transition-colors ${activeSection === section.id
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-lg border p-6 space-y-6">
              {activeSection === 'website' && (
                <>
                  <h2 className="text-xl">Website Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <Label>Website Name</Label>
                      <Input
                        value={settings.website.name}
                        onChange={(e) => updateSection('website', 'name', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Slogan</Label>
                      <Input
                        value={settings.website.slogan}
                        onChange={(e) => updateSection('website', 'slogan', e.target.value)}
                      />
                    </div>

                    <div>
                      <ImageUpload
                        label="Header Logo"
                        value={settings.website.headerLogo}
                        onChange={(value) => updateSection('website', 'headerLogo', value)}
                      />
                    </div>

                    <div>
                      <ImageUpload
                        label="Footer Logo"
                        value={settings.website.footerLogo}
                        onChange={(value) => updateSection('website', 'footerLogo', value)}
                      />
                    </div>
                  </div>
                </>
              )}

              {activeSection === 'contact' && (
                <>
                  <h2 className="text-xl">Contact Information</h2>
                  <div className="space-y-4">
                    <div>
                      <Label>Phone Number</Label>
                      <Input
                        value={settings.contact.phone}
                        onChange={(e) => updateSection('contact', 'phone', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        value={settings.contact.email}
                        onChange={(e) => updateSection('contact', 'email', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Address</Label>
                      <Textarea
                        value={settings.contact.address}
                        onChange={(e) => updateSection('contact', 'address', e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}

              {activeSection === 'footer' && (
                <>
                  <h2 className="text-xl">Footer Information</h2>
                  <div className="space-y-4">
                    <div>
                      <Label>Footer Text</Label>
                      <Textarea
                        value={settings.footer.text}
                        onChange={(e) => updateSection('footer', 'text', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Copyright Text</Label>
                      <Input
                        value={settings.footer.copyright}
                        onChange={(e) => updateSection('footer', 'copyright', e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}

              {activeSection === 'social' && (
                <>
                  <h2 className="text-xl">Social Media</h2>
                  <div className="space-y-4">
                    <div>
                      <Label>Facebook URL</Label>
                      <Input
                        value={settings.social.facebook}
                        onChange={(e) => updateSection('social', 'facebook', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Twitter URL</Label>
                      <Input
                        value={settings.social.twitter}
                        onChange={(e) => updateSection('social', 'twitter', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Instagram URL</Label>
                      <Input
                        value={settings.social.instagram}
                        onChange={(e) => updateSection('social', 'instagram', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>LinkedIn URL</Label>
                      <Input
                        value={settings.social.linkedin}
                        onChange={(e) => updateSection('social', 'linkedin', e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}

              {activeSection === 'mail' && (
                <>
                  <h2 className="text-xl">Mail Configuration</h2>
                  <div className="space-y-4">
                    <div>
                      <Label>SMTP Host</Label>
                      <Input
                        value={settings.mail.host}
                        onChange={(e) => updateSection('mail', 'host', e.target.value)}
                        placeholder="smtp.example.com"
                      />
                    </div>

                    <div>
                      <Label>SMTP Port</Label>
                      <Input
                        value={settings.mail.port}
                        onChange={(e) => updateSection('mail', 'port', e.target.value)}
                        placeholder="587"
                      />
                    </div>

                    <div>
                      <Label>SMTP Username</Label>
                      <Input
                        value={settings.mail.username}
                        onChange={(e) => updateSection('mail', 'username', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>SMTP Password</Label>
                      <Input
                        type="password"
                        value={settings.mail.password}
                        onChange={(e) => updateSection('mail', 'password', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>From Email</Label>
                      <Input
                        type="email"
                        value={settings.mail.fromEmail}
                        onChange={(e) => updateSection('mail', 'fromEmail', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>From Name</Label>
                      <Input
                        value={settings.mail.fromName}
                        onChange={(e) => updateSection('mail', 'fromName', e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}

              {activeSection === 'security' && (
                <>
                  <h2 className="text-xl">Security Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label>Enable SSL</Label>
                        <p className="text-sm text-gray-600">Force HTTPS connections</p>
                      </div>
                      <Switch
                        checked={settings.security.enableSSL}
                        onCheckedChange={(checked: boolean) => updateSection('security', 'enableSSL', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label>Enable CAPTCHA</Label>
                        <p className="text-sm text-gray-600">Protect forms with CAPTCHA</p>
                      </div>
                      <Switch
                        checked={settings.security.enableCaptcha}
                        onCheckedChange={(checked: boolean) => updateSection('security', 'enableCaptcha', checked)}
                      />
                    </div>

                    <div>
                      <Label>Session Timeout (minutes)</Label>
                      <Input
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => updateSection('security', 'sessionTimeout', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </>
              )}

              {activeSection === 'theme' && (
                <>
                  <h2 className="text-xl">Theme Colors</h2>
                  <div className="space-y-4">
                    <div>
                      <Label>Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={settings.theme.primaryColor}
                          onChange={(e) => updateSection('theme', 'primaryColor', e.target.value)}
                          className="w-20 h-10"
                        />
                        <Input
                          value={settings.theme.primaryColor}
                          onChange={(e) => updateSection('theme', 'primaryColor', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Secondary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={settings.theme.secondaryColor}
                          onChange={(e) => updateSection('theme', 'secondaryColor', e.target.value)}
                          className="w-20 h-10"
                        />
                        <Input
                          value={settings.theme.secondaryColor}
                          onChange={(e) => updateSection('theme', 'secondaryColor', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Accent Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={settings.theme.accentColor}
                          onChange={(e) => updateSection('theme', 'accentColor', e.target.value)}
                          className="w-20 h-10"
                        />
                        <Input
                          value={settings.theme.accentColor}
                          onChange={(e) => updateSection('theme', 'accentColor', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Text Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={settings.theme.textColor}
                          onChange={(e) => updateSection('theme', 'textColor', e.target.value)}
                          className="w-20 h-10"
                        />
                        <Input
                          value={settings.theme.textColor}
                          onChange={(e) => updateSection('theme', 'textColor', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="pt-4 border-t">
                <Button onClick={handleSave}>
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}