import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Switch } from '../../components/ui/switch';
import { getData, setData } from '../../utils/localStorage';
import { toast } from 'sonner@2.0.3';
import { Mail, MessageSquare, Save, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';

interface Template {
  enabled: boolean;
  subject: string;
  body: string;
  smsBody: string;
}

interface Templates {
  welcome: Template;
  followUp: Template;
  siteVisit: Template;
  thankYou: Template;
  leadStatus: Template;
}

export function EmailTemplates() {
  const [templates, setTemplates] = useState<Templates>({
    welcome: {
      enabled: true,
      subject: 'Thank you for your interest in {PROJECT_NAME}',
      body: 'Dear {CUSTOMER_NAME},\n\nThank you for showing interest in {PROJECT_NAME}. We have received your enquiry and our team will get back to you shortly.\n\nYour Enquiry Details:\nProject: {PROJECT_NAME}\nPhone: {CUSTOMER_PHONE}\nEmail: {CUSTOMER_EMAIL}\n\nFor immediate assistance, please call us at {COMPANY_PHONE} or WhatsApp us.\n\nBest Regards,\n{COMPANY_NAME}',
      smsBody: 'Hi {CUSTOMER_NAME}, Thank you for your interest in {PROJECT_NAME}. Our team will contact you soon. Call us: {COMPANY_PHONE}'
    },
    followUp: {
      enabled: true,
      subject: 'Following up on your enquiry for {PROJECT_NAME}',
      body: 'Dear {CUSTOMER_NAME},\n\nWe wanted to follow up on your recent enquiry for {PROJECT_NAME}.\n\nHave you had a chance to review the details we shared? We would love to answer any questions you may have.\n\nWould you like to schedule a site visit? We have slots available this week.\n\nBest Regards,\n{COMPANY_NAME}',
      smsBody: 'Hi {CUSTOMER_NAME}, Following up on {PROJECT_NAME}. Would you like to schedule a site visit? Reply YES or call {COMPANY_PHONE}'
    },
    siteVisit: {
      enabled: true,
      subject: 'Site Visit Confirmation for {PROJECT_NAME}',
      body: 'Dear {CUSTOMER_NAME},\n\nYour site visit has been scheduled!\n\nProject: {PROJECT_NAME}\nDate: {VISIT_DATE}\nTime: {VISIT_TIME}\nLocation: {PROJECT_LOCATION}\n\nOur representative will be waiting for you. Please bring a valid ID.\n\nFor any changes, please call us at {COMPANY_PHONE}.\n\nSee you soon!\n{COMPANY_NAME}',
      smsBody: 'Site visit confirmed for {PROJECT_NAME} on {VISIT_DATE} at {VISIT_TIME}. Location: {PROJECT_LOCATION}. Contact: {COMPANY_PHONE}'
    },
    thankYou: {
      enabled: true,
      subject: 'Thank you for visiting {PROJECT_NAME}',
      body: 'Dear {CUSTOMER_NAME},\n\nThank you for visiting {PROJECT_NAME} today. We hope you had a great experience.\n\nIf you have any questions or would like to know more about the project, please feel free to reach out to us.\n\nSpecial offers are available for early bookings!\n\nBest Regards,\n{COMPANY_NAME}',
      smsBody: 'Thank you for visiting {PROJECT_NAME}! Special offers available. Contact us: {COMPANY_PHONE}'
    },
    leadStatus: {
      enabled: true,
      subject: 'Update on your enquiry - {PROJECT_NAME}',
      body: 'Dear {CUSTOMER_NAME},\n\nYour enquiry status has been updated to: {LEAD_STATUS}\n\nProject: {PROJECT_NAME}\nReference Number: {REFERENCE_NUMBER}\n\nNext Steps: {NEXT_STEPS}\n\nIf you have any questions, please contact your relationship manager or call us at {COMPANY_PHONE}.\n\nBest Regards,\n{COMPANY_NAME}',
      smsBody: 'Your enquiry for {PROJECT_NAME} status: {LEAD_STATUS}. Ref: {REFERENCE_NUMBER}. Contact: {COMPANY_PHONE}'
    }
  });

  const [previewTemplate, setPreviewTemplate] = useState<{ type: string; template: Template } | null>(null);

  useEffect(() => {
    const savedTemplates = getData('emailTemplates');
    if (savedTemplates) {
      setTemplates(savedTemplates);
    }
  }, []);

  const handleSave = () => {
    setData('emailTemplates', templates);
    toast.success('Email/SMS templates saved successfully!');
  };

  const updateTemplate = (type: keyof Templates, field: keyof Template, value: any) => {
    setTemplates({
      ...templates,
      [type]: {
        ...templates[type],
        [field]: value
      }
    });
  };

  const availableVariables = [
    '{CUSTOMER_NAME}',
    '{CUSTOMER_EMAIL}',
    '{CUSTOMER_PHONE}',
    '{PROJECT_NAME}',
    '{PROJECT_LOCATION}',
    '{COMPANY_NAME}',
    '{COMPANY_PHONE}',
    '{VISIT_DATE}',
    '{VISIT_TIME}',
    '{LEAD_STATUS}',
    '{REFERENCE_NUMBER}',
    '{NEXT_STEPS}'
  ];

  const renderTemplateCard = (type: keyof Templates, title: string, description: string) => {
    const template = templates[type];
    return (
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg mb-1">{title}</h3>
            <p className="text-sm text-slate-600">{description}</p>
          </div>
          <Switch
            checked={template.enabled}
            onCheckedChange={(checked) => updateTemplate(type, 'enabled', checked)}
          />
        </div>

        <div className="space-y-4">
          <div>
            <Label>Email Subject</Label>
            <Input
              value={template.subject}
              onChange={(e) => updateTemplate(type, 'subject', e.target.value)}
              disabled={!template.enabled}
            />
          </div>

          <div>
            <Label>Email Body</Label>
            <Textarea
              value={template.body}
              onChange={(e) => updateTemplate(type, 'body', e.target.value)}
              rows={8}
              disabled={!template.enabled}
              className="font-mono text-sm"
            />
          </div>

          <div>
            <Label>SMS Body (160 characters recommended)</Label>
            <Textarea
              value={template.smsBody}
              onChange={(e) => updateTemplate(type, 'smsBody', e.target.value)}
              rows={3}
              disabled={!template.enabled}
              className="font-mono text-sm"
            />
            <p className="text-xs text-slate-500 mt-1">
              Characters: {template.smsBody.length}/160
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewTemplate({ type: title, template })}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2">Email & SMS Templates</h1>
            <p className="text-slate-600">Configure automated messages for different scenarios</p>
          </div>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save All Templates
          </Button>
        </div>

        {/* Available Variables */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Available Variables
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableVariables.map((variable) => (
              <code
                key={variable}
                className="px-2 py-1 bg-white border rounded text-sm cursor-pointer hover:bg-blue-100"
                onClick={() => {
                  navigator.clipboard.writeText(variable);
                  toast.success('Variable copied to clipboard!');
                }}
              >
                {variable}
              </code>
            ))}
          </div>
          <p className="text-xs text-slate-600 mt-2">
            Click to copy. These variables will be automatically replaced with actual values.
          </p>
        </Card>

        <Tabs defaultValue="auto" className="space-y-6">
          <TabsList>
            <TabsTrigger value="auto">Auto-Response</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="visit">Site Visits</TabsTrigger>
          </TabsList>

          <TabsContent value="auto" className="space-y-6">
            {renderTemplateCard(
              'welcome',
              'Welcome Email',
              'Sent immediately when a lead submits an enquiry'
            )}
            {renderTemplateCard(
              'thankYou',
              'Thank You Email',
              'Sent after a site visit or customer interaction'
            )}
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            {renderTemplateCard(
              'followUp',
              'Follow-up Email',
              'Sent to engage with leads who haven\'t responded'
            )}
            {renderTemplateCard(
              'leadStatus',
              'Lead Status Update',
              'Sent when lead status changes'
            )}
          </TabsContent>

          <TabsContent value="visit" className="space-y-6">
            {renderTemplateCard(
              'siteVisit',
              'Site Visit Confirmation',
              'Sent when a site visit is scheduled'
            )}
          </TabsContent>
        </Tabs>

        {/* Preview Dialog */}
        <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Preview: {previewTemplate?.type}</DialogTitle>
              <DialogDescription>
                Preview of email and SMS template content
              </DialogDescription>
            </DialogHeader>
            
            {previewTemplate && (
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-slate-500">Email Subject</Label>
                  <div className="p-3 bg-slate-50 rounded mt-1">
                    {previewTemplate.template.subject}
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-slate-500">Email Body</Label>
                  <div className="p-3 bg-slate-50 rounded mt-1 whitespace-pre-wrap">
                    {previewTemplate.template.body}
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-slate-500">SMS Body</Label>
                  <div className="p-3 bg-slate-50 rounded mt-1">
                    {previewTemplate.template.smsBody}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}