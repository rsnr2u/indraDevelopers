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
import { AlertTriangle, Save } from 'lucide-react';

export function ExitIntentSettings() {
  const [settings, setSettings] = useState({
    enabled: true,
    title: "Wait! Don't Miss Out",
    description: "Get exclusive access to our latest projects and special offers",
    ctaText: "Get Instant Access",
    showBenefits: true,
    redirectToWhatsApp: false,
    showDelay: 0
  });

  useEffect(() => {
    const loadSettings = async () => {
      const savedSettings = await getData('exitIntentSettings');
      if (savedSettings && !Array.isArray(savedSettings)) {
        setSettings(savedSettings);
      }
    };
    loadSettings();
  }, []);

  const handleSave = () => {
    setData('exitIntentSettings', settings);
    toast.success('Exit intent popup settings saved successfully!');
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2">Exit Intent Popup</h1>
            <p className="text-slate-600">Capture leads when visitors are about to leave your website</p>
          </div>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>

        <Card className="p-6">
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Popup Configuration
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Exit Intent Popup</Label>
                <p className="text-sm text-slate-500">Show popup when users move cursor to leave the page</p>
              </div>
              <Switch
                checked={settings.enabled}
                onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
              />
            </div>

            <div>
              <Label htmlFor="title">Popup Title</Label>
              <Input
                id="title"
                value={settings.title}
                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                placeholder="Wait! Don't Miss Out"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={settings.description}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                placeholder="Get exclusive access to our latest projects"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="ctaText">Call-to-Action Button Text</Label>
              <Input
                id="ctaText"
                value={settings.ctaText}
                onChange={(e) => setSettings({ ...settings, ctaText: e.target.value })}
                placeholder="Get Instant Access"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Show Benefits List</Label>
                <p className="text-sm text-slate-500">Display list of benefits below the form</p>
              </div>
              <Switch
                checked={settings.showBenefits}
                onCheckedChange={(checked) => setSettings({ ...settings, showBenefits: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Redirect to WhatsApp After Submit</Label>
                <p className="text-sm text-slate-500">Open WhatsApp after form submission</p>
              </div>
              <Switch
                checked={settings.redirectToWhatsApp}
                onCheckedChange={(checked) => setSettings({ ...settings, redirectToWhatsApp: checked })}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-medium mb-2">How It Works</h3>
          <ul className="text-sm text-slate-700 space-y-1">
            <li>• Popup appears when user moves mouse to leave the page</li>
            <li>• Shows once per session (won't annoy users)</li>
            <li>• Captures name, phone, and email</li>
            <li>• Saves lead with source "Exit Intent Popup"</li>
            <li>• Optionally redirects to WhatsApp</li>
          </ul>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg">
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
