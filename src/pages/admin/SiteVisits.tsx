import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { getData, updateItem, deleteItem, addItem } from '../../utils/localStorage';
import { toast } from 'sonner@2.0.3';
import { Calendar, Clock, MapPin, User, Phone, Mail, Edit, Trash2, Plus, Check, X } from 'lucide-react';

interface SiteVisit {
  id: string;
  leadId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  projectId: string;
  visitDate: string;
  visitTime: string;
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No Show';
  notes: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}

export function SiteVisits() {
  const navigate = useNavigate();
  const [visits, setVisits] = useState<SiteVisit[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<SiteVisit>>({
    leadId: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    projectId: '',
    visitDate: '',
    visitTime: '',
    status: 'Scheduled',
    notes: '',
    assignedTo: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setVisits(getData('siteVisits') || []);
    setProjects(getData('projects') || []);
    setLeads(getData('leads') || []);
  };

  const handleSave = () => {
    if (!formData.customerName || !formData.customerPhone || !formData.projectId || !formData.visitDate) {
      toast.error('Please fill in required fields');
      return;
    }

    const visitData = {
      ...formData,
      updatedAt: new Date().toISOString(),
      createdAt: formData.createdAt || new Date().toISOString()
    };

    if (editingId) {
      updateItem('siteVisits', editingId, visitData);
      toast.success('Site visit updated successfully!');
    } else {
      addItem('siteVisits', visitData);
      toast.success('Site visit scheduled successfully!');
    }

    resetForm();
    loadData();
  };

  const handleEdit = (visit: SiteVisit) => {
    setFormData(visit);
    setEditingId(visit.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this site visit?')) {
      deleteItem('siteVisits', id);
      toast.success('Site visit deleted successfully!');
      loadData();
    }
  };

  const handleStatusChange = (id: string, status: SiteVisit['status']) => {
    updateItem('siteVisits', id, { status, updatedAt: new Date().toISOString() });
    toast.success(`Status updated to ${status}`);
    loadData();
  };

  const resetForm = () => {
    setFormData({
      leadId: '',
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      projectId: '',
      visitDate: '',
      visitTime: '',
      status: 'Scheduled',
      notes: '',
      assignedTo: ''
    });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleLeadSelect = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      setFormData({
        ...formData,
        leadId,
        customerName: lead.name,
        customerPhone: lead.phone,
        customerEmail: lead.email,
        projectId: lead.projectInterest || ''
      });
    }
  };

  const filteredVisits = visits.filter(visit => {
    const matchesStatus = filterStatus === 'all' || visit.status === filterStatus;
    const matchesSearch = 
      (visit.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (visit.customerPhone || '').includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-purple-100 text-purple-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'No Show': return 'bg-orange-100 text-orange-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const stats = {
    total: visits.length,
    scheduled: visits.filter(v => v.status === 'Scheduled').length,
    confirmed: visits.filter(v => v.status === 'Confirmed').length,
    completed: visits.filter(v => v.status === 'Completed').length,
    cancelled: visits.filter(v => v.status === 'Cancelled').length
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2">Site Visits Management</h1>
            <p className="text-slate-600">Schedule and manage customer site visits</p>
          </div>
          <Button onClick={() => navigate('/admin/schedule-visit')}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Visit
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4">
            <p className="text-sm text-slate-600 mb-1">Total Visits</p>
            <p className="text-2xl">{stats.total}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-slate-600 mb-1">Scheduled</p>
            <p className="text-2xl text-blue-600">{stats.scheduled}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-slate-600 mb-1">Confirmed</p>
            <p className="text-2xl text-green-600">{stats.confirmed}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-slate-600 mb-1">Completed</p>
            <p className="text-2xl text-purple-600">{stats.completed}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-slate-600 mb-1">Cancelled</p>
            <p className="text-2xl text-red-600">{stats.cancelled}</p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="No Show">No Show</option>
            </select>
          </div>
        </Card>

        {/* Visits List */}
        <div className="space-y-4">
          {filteredVisits.map((visit) => {
            const project = projects.find(p => p.id === visit.projectId);
            return (
              <Card key={visit.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg">{visit.customerName}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(visit.status)}`}>
                        {visit.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {visit.customerPhone}
                      </div>
                      {visit.customerEmail && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {visit.customerEmail}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {project?.name || 'N/A'}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {visit.visitDate}
                      </div>
                      {visit.visitTime && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {visit.visitTime}
                        </div>
                      )}
                      {visit.assignedTo && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {visit.assignedTo}
                        </div>
                      )}
                    </div>

                    {visit.notes && (
                      <p className="mt-3 text-sm text-slate-600 bg-slate-50 p-3 rounded">
                        {visit.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/admin/schedule-visit', { state: { visit } })}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(visit.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>

                {/* Quick Actions */}
                {visit.status !== 'Completed' && visit.status !== 'Cancelled' && (
                  <div className="flex gap-2 pt-4 border-t">
                    {visit.status === 'Scheduled' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(visit.id, 'Confirmed')}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Confirm
                      </Button>
                    )}
                    {(visit.status === 'Scheduled' || visit.status === 'Confirmed') && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(visit.id, 'Completed')}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(visit.id, 'Cancelled')}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {filteredVisits.length === 0 && (
          <Card className="p-12 text-center">
            <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl mb-2">No site visits found</h3>
            <p className="text-slate-600 mb-4">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Schedule your first site visit'}
            </p>
          </Card>
        )}

        {/* Schedule Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Edit Site Visit' : 'Schedule Site Visit'}
              </DialogTitle>
              <DialogDescription>
                {editingId ? 'Update site visit details and status' : 'Schedule a new site visit for a customer'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="lead">Select from Existing Lead (Optional)</Label>
                <select
                  id="lead"
                  value={formData.leadId}
                  onChange={(e) => handleLeadSelect(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Select a lead or enter manually</option>
                  {leads.map(lead => (
                    <option key={lead.id} value={lead.id}>
                      {lead.name} - {lead.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Phone Number *</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="customerEmail">Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <Label htmlFor="project">Project *</Label>
                <select
                  id="project"
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Select Project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="visitDate">Visit Date *</Label>
                  <Input
                    id="visitDate"
                    type="date"
                    value={formData.visitDate}
                    onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="visitTime">Visit Time</Label>
                  <Input
                    id="visitTime"
                    type="time"
                    value={formData.visitTime}
                    onChange={(e) => setFormData({ ...formData, visitTime: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Input
                  id="assignedTo"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  placeholder="Sales representative name"
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as SiteVisit['status'] })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="No Show">No Show</option>
                </select>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any special requirements or notes..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingId ? 'Update' : 'Schedule'} Visit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}