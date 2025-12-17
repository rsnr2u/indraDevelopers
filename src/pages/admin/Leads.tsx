import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getData, updateItem, addItem } from '../../utils/localStorage';
import { toast } from 'sonner';
import { Eye, Mail, Phone, Filter, X, Search, Plus } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';

export function Leads() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<any[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<any[]>([]);
  const [showManualLeadDialog, setShowManualLeadDialog] = useState(false);
  const [manualLeadForm, setManualLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    project: '',
    source: 'Manual Entry',
    message: '',
    status: 'New'
  });
  const [filters, setFilters] = useState({
    status: 'All',
    source: 'All',
    search: '',
    dateFrom: '',
    dateTo: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [leads, filters]);

  const loadData = async () => {
    const allLeads = await getData('leads') || [];
    setLeads(allLeads);
  };

  const applyFilters = () => {
    let filtered = [...leads];

    // Status filter
    if (filters.status !== 'All') {
      filtered = filtered.filter(lead => lead.status === filters.status);
    }

    // Source filter
    if (filters.source !== 'All') {
      filtered = filtered.filter(lead => lead.source === filters.source);
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(lead =>
        (lead.name?.toLowerCase() || '').includes(searchLower) ||
        (lead.email?.toLowerCase() || '').includes(searchLower) ||
        (lead.phone?.toLowerCase() || '').includes(searchLower) ||
        (lead.projectInterest?.toLowerCase() || '').includes(searchLower)
      );
    }

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(lead =>
        new Date(lead.createdAt) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(lead =>
        new Date(lead.createdAt) <= new Date(filters.dateTo)
      );
    }

    setFilteredLeads(filtered);
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    await updateItem('leads', leadId, { status: newStatus });
    loadData();
    toast.success('Lead status updated successfully!');
  };

  const clearFilters = () => {
    setFilters({
      status: 'All',
      source: 'All',
      search: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const viewLead = (leadId: string) => {
    navigate(`/admin/leads/${leadId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Contacted':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Qualified':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Converted':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Lost':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const statuses = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];
  const sources = ['Website Contact Form', 'Phone Call', 'Email', 'Social Media', 'Walk-in', 'Referral'];

  const getStatusCount = (status: string) => {
    return leads.filter(lead => lead.status === status).length;
  };

  const activeFiltersCount = [
    filters.status !== 'All',
    filters.source !== 'All',
    filters.search !== '',
    filters.dateFrom !== '',
    filters.dateTo !== ''
  ].filter(Boolean).length;

  const handleManualLeadSubmit = async () => {
    const newLead = {
      name: manualLeadForm.name,
      email: manualLeadForm.email,
      phone: manualLeadForm.phone,
      projectInterest: manualLeadForm.project,
      source: manualLeadForm.source,
      message: manualLeadForm.message,
      status: manualLeadForm.status,
      createdAt: new Date().toISOString()
    };
    await addItem('leads', newLead);
    loadData();
    toast.success('Lead added successfully!');
    setShowManualLeadDialog(false);
    setManualLeadForm({
      name: '',
      email: '',
      phone: '',
      project: '',
      source: 'Manual Entry',
      message: '',
      status: 'New'
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl">Leads Management</h1>
          <div className="flex gap-2">
            <Button
              variant={showFilters ? 'default' : 'outline'}
              onClick={() => setShowFilters(!showFilters)}
              className="relative"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowManualLeadDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg border p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="All">All Statuses</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Source</label>
                <select
                  value={filters.source}
                  onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="All">All Sources</option>
                  {sources.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">From Date</label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">To Date</label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                />
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, phone, or project..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        )}

        {/* Status Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {statuses.map(status => (
            <div key={status} className={`p-4 rounded-lg border ${getStatusColor(status)}`}>
              <div className="text-sm">{status}</div>
              <div className="text-2xl mt-1">{getStatusCount(status)}</div>
            </div>
          ))}
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {filteredLeads.length} of {leads.length} leads
          </p>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Contact</th>
                  <th className="text-left p-4">Project Interest</th>
                  <th className="text-left p-4">Source</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div>{lead.name}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          <span>{lead.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          <span>{lead.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{lead.projectInterest || '-'}</td>
                    <td className="p-4">{lead.source}</td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                        className={`px-3 py-1 rounded border text-sm ${getStatusColor(lead.status)}`}
                      >
                        {statuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => viewLead(lead.id)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="text-sm">View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLeads.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              {leads.length === 0 ? 'No leads found' : 'No leads match your filters'}
            </div>
          )}
        </div>
      </div>

      {/* Manual Lead Dialog */}
      <Dialog open={showManualLeadDialog} onOpenChange={setShowManualLeadDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Manual Lead</DialogTitle>
            <DialogDescription>
              Enter the details of the lead you want to add manually.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={manualLeadForm.name}
                onChange={(e) => setManualLeadForm({ ...manualLeadForm, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={manualLeadForm.email}
                onChange={(e) => setManualLeadForm({ ...manualLeadForm, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={manualLeadForm.phone}
                onChange={(e) => setManualLeadForm({ ...manualLeadForm, phone: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project">Project Interest</Label>
              <Input
                id="project"
                value={manualLeadForm.project}
                onChange={(e) => setManualLeadForm({ ...manualLeadForm, project: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="source">Source</Label>
              <select
                id="source"
                value={manualLeadForm.source}
                onChange={(e) => setManualLeadForm({ ...manualLeadForm, source: e.target.value })}
                className="col-span-3 border rounded-lg px-3 py-2 text-sm"
              >
                <option value="Manual Entry">Manual Entry</option>
                {sources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={manualLeadForm.message}
                onChange={(e) => setManualLeadForm({ ...manualLeadForm, message: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={manualLeadForm.status}
                onChange={(e) => setManualLeadForm({ ...manualLeadForm, status: e.target.value })}
                className="col-span-3 border rounded-lg px-3 py-2 text-sm"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setShowManualLeadDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleManualLeadSubmit}
            >
              Add Lead
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}