import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { getData, addItem, updateItem } from '../../utils/localStorage';
import { toast } from 'sonner@2.0.3';
import { Calendar, Clock, User, MapPin, Phone, Mail, ArrowLeft } from 'lucide-react';

export function ScheduleVisit() {
  const navigate = useNavigate();
  const location = useLocation();
  const editingVisit = location.state?.visit;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectId: '',
    projectName: '',
    visitDate: '',
    visitTime: '',
    numberOfPeople: '1',
    specialRequirements: '',
    status: 'Scheduled',
    assignedTo: ''
  });
  
  const [projects, setProjects] = useState<any[]>([]);
  const [nameSearch, setNameSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    const projectsData = getData('projects') || [];
    setProjects(projectsData.filter((p: any) => p.status === 'Active'));
    
    if (editingVisit) {
      setFormData(editingVisit);
      setNameSearch(editingVisit.name);
    }
  }, []);

  useEffect(() => {
    if (nameSearch.length >= 2) {
      const leads = getData('leads') || [];
      const results = leads.filter((lead: any) =>
        (lead.name?.toLowerCase() || '').includes(nameSearch.toLowerCase()) ||
        (lead.email?.toLowerCase() || '').includes(nameSearch.toLowerCase()) ||
        (lead.phone || '').includes(nameSearch)
      );
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [nameSearch]);

  const handleLeadSelect = (lead: any) => {
    setFormData({
      ...formData,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      projectId: lead.projectInterest || '',
      projectName: lead.projectInterest || ''
    });
    setNameSearch(lead.name);
    setShowSearchResults(false);
  };

  const handleProjectChange = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    setFormData({
      ...formData,
      projectId,
      projectName: project?.name || ''
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.phone || !formData.projectId || !formData.visitDate || !formData.visitTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    const visitData = {
      ...formData,
      createdAt: editingVisit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingVisit) {
      updateItem('siteVisits', editingVisit.id, visitData);
      toast.success('Site visit updated successfully!');
    } else {
      addItem('siteVisits', visitData);
      toast.success('Site visit scheduled successfully!');
    }

    navigate('/admin/site-visits');
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/site-visits')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl">{editingVisit ? 'Edit' : 'Schedule'} Site Visit</h1>
            <p className="text-slate-600 mt-1">
              {editingVisit ? 'Update site visit details' : 'Schedule a new site visit for a customer'}
            </p>
          </div>
        </div>

        <Card className="p-6">
          <div className="space-y-6">
            {/* Customer Information */}
            <div>
              <h3 className="text-lg font-medium mb-4 pb-2 border-b flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 relative">
                  <Label htmlFor="nameSearch">Search Customer Name / Email / Phone *</Label>
                  <Input
                    id="nameSearch"
                    value={nameSearch}
                    onChange={(e) => {
                      setNameSearch(e.target.value);
                      setFormData({ ...formData, name: e.target.value });
                    }}
                    placeholder="Start typing to search from existing leads..."
                  />
                  
                  {showSearchResults && searchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {searchResults.map((lead) => (
                        <div
                          key={lead.id}
                          onClick={() => handleLeadSelect(lead)}
                          className="p-3 hover:bg-slate-50 cursor-pointer border-b last:border-b-0"
                        >
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-sm text-slate-600 flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {lead.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {lead.phone}
                            </span>
                          </div>
                          {lead.projectInterest && (
                            <div className="text-xs text-slate-500 mt-1">
                              Interested in: {lead.projectInterest}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs text-slate-500 mt-1">
                    Search from existing leads or enter new customer details
                  </p>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="customer@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            {/* Visit Details */}
            <div>
              <h3 className="text-lg font-medium mb-4 pb-2 border-b flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Visit Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="project">Select Project *</Label>
                  <select
                    id="project"
                    value={formData.projectId}
                    onChange={(e) => handleProjectChange(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name} - {project.location}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="visitDate">Visit Date *</Label>
                  <Input
                    id="visitDate"
                    type="date"
                    value={formData.visitDate}
                    onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <Label htmlFor="visitTime">Visit Time *</Label>
                  <Input
                    id="visitTime"
                    type="time"
                    value={formData.visitTime}
                    onChange={(e) => setFormData({ ...formData, visitTime: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="numberOfPeople">Number of People</Label>
                  <Input
                    id="numberOfPeople"
                    type="number"
                    min="1"
                    value={formData.numberOfPeople}
                    onChange={(e) => setFormData({ ...formData, numberOfPeople: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Input
                    id="assignedTo"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    placeholder="Staff member name"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="specialRequirements">Special Requirements</Label>
                  <Textarea
                    id="specialRequirements"
                    value={formData.specialRequirements}
                    onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                    placeholder="Any special requirements or notes..."
                    rows={3}
                  />
                </div>

                {editingVisit && (
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="No Show">No Show</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => navigate('/admin/site-visits')}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingVisit ? 'Update' : 'Schedule'} Visit
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}