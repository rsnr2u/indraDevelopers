import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Card } from '../../components/ui/card';
import { getData } from '../../utils/localStorage';
import { TrendingUp, Eye, MousePointerClick, Users, Phone, Calendar, MessageSquare, Download } from 'lucide-react';

export function Analytics() {
  const [analytics, setAnalytics] = useState<any>({
    pageViews: {},
    projectViews: {},
    leads: [],
    siteVisits: [],
    brochureDownloads: {},
    clickToCalls: {},
    shareClicks: {}
  });
  const [projects, setProjects] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState('7days');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    const analyticsData = getData('analytics') || {
      pageViews: {},
      projectViews: {},
      brochureDownloads: {},
      clickToCalls: {},
      shareClicks: {}
    };
    
    const leads = getData('leads') || [];
    const siteVisits = getData('siteVisits') || [];
    const projectsData = getData('projects') || [];
    
    setAnalytics({ ...analyticsData, leads, siteVisits });
    setProjects(projectsData);
  };

  const filterByDateRange = (data: any[], dateField: string = 'createdAt') => {
    const now = new Date();
    const ranges: any = {
      '7days': 7,
      '30days': 30,
      '90days': 90,
      'all': null
    };
    
    const days = ranges[dateRange];
    if (!days) return data;
    
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return data.filter((item: any) => new Date(item[dateField]) >= cutoffDate);
  };

  const filteredLeads = filterByDateRange(analytics.leads);
  const filteredVisits = filterByDateRange(analytics.siteVisits);

  // Calculate conversion rates
  const totalPageViews = Object.values(analytics.pageViews).reduce((sum: number, val: any) => sum + val, 0);
  const conversionRate = totalPageViews > 0 ? ((filteredLeads.length / totalPageViews) * 100).toFixed(2) : '0.00';

  // Lead source breakdown
  const leadSources = filteredLeads.reduce((acc: any, lead: any) => {
    const source = lead.source || 'Direct';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  // Project performance
  const projectPerformance = projects.map(project => {
    const views = analytics.projectViews[project.id] || 0;
    const projectLeads = filteredLeads.filter((l: any) => l.projectInterest === project.name || l.projectId === project.id);
    const downloads = analytics.brochureDownloads[project.id] || 0;
    const calls = analytics.clickToCalls[project.id] || 0;
    const shares = analytics.shareClicks[project.id] || 0;
    
    return {
      project,
      views,
      leads: projectLeads.length,
      downloads,
      calls,
      shares,
      conversionRate: views > 0 ? ((projectLeads.length / views) * 100).toFixed(2) : '0.00'
    };
  }).sort((a, b) => b.views - a.views);

  // Time-based analytics
  const leadsOverTime = filteredLeads.reduce((acc: any, lead: any) => {
    const date = new Date(lead.createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  // Lead status distribution
  const leadStatusCount = filteredLeads.reduce((acc: any, lead: any) => {
    const status = lead.status || 'New';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2">Analytics & Heat Map</h1>
            <p className="text-slate-600">Track performance, conversions, and user behavior</p>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">Total Page Views</p>
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-3xl mb-1">{totalPageViews}</p>
            <p className="text-xs text-slate-500">Across all pages</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">Total Leads</p>
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl mb-1">{filteredLeads.length}</p>
            <p className="text-xs text-slate-500">{conversionRate}% conversion rate</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">Site Visits</p>
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-3xl mb-1">{filteredVisits.length}</p>
            <p className="text-xs text-slate-500">Scheduled & completed</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">Phone Calls</p>
              <Phone className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-3xl mb-1">
              {Object.values(analytics.clickToCalls).reduce((sum: number, val: any) => sum + val, 0)}
            </p>
            <p className="text-xs text-slate-500">Click-to-call actions</p>
          </Card>
        </div>

        {/* Project Performance Heat Map */}
        <Card className="p-6">
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Project Performance Heat Map
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-slate-600">Project</th>
                  <th className="text-center p-3 text-sm font-medium text-slate-600">
                    <Eye className="h-4 w-4 mx-auto" />
                    Views
                  </th>
                  <th className="text-center p-3 text-sm font-medium text-slate-600">
                    <Users className="h-4 w-4 mx-auto" />
                    Leads
                  </th>
                  <th className="text-center p-3 text-sm font-medium text-slate-600">
                    <Download className="h-4 w-4 mx-auto" />
                    Downloads
                  </th>
                  <th className="text-center p-3 text-sm font-medium text-slate-600">
                    <Phone className="h-4 w-4 mx-auto" />
                    Calls
                  </th>
                  <th className="text-center p-3 text-sm font-medium text-slate-600">
                    <MessageSquare className="h-4 w-4 mx-auto" />
                    Shares
                  </th>
                  <th className="text-center p-3 text-sm font-medium text-slate-600">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {projectPerformance.map((item, index) => {
                  const maxViews = Math.max(...projectPerformance.map(p => p.views));
                  const heatIntensity = maxViews > 0 ? (item.views / maxViews) * 100 : 0;
                  
                  return (
                    <tr key={item.project.id} className="border-b hover:bg-slate-50">
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{item.project.name}</p>
                          <p className="text-xs text-slate-500">Rank #{index + 1}</p>
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <div 
                          className="inline-block px-3 py-1 rounded"
                          style={{ 
                            backgroundColor: `rgba(59, 130, 246, ${heatIntensity / 100})`,
                            color: heatIntensity > 50 ? 'white' : 'inherit'
                          }}
                        >
                          {item.views}
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded">
                          {item.leads}
                        </span>
                      </td>
                      <td className="text-center p-3">{item.downloads}</td>
                      <td className="text-center p-3">{item.calls}</td>
                      <td className="text-center p-3">{item.shares}</td>
                      <td className="text-center p-3">
                        <span className={`px-2 py-1 rounded text-sm ${
                          parseFloat(item.conversionRate) > 5 ? 'bg-green-100 text-green-800' :
                          parseFloat(item.conversionRate) > 2 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.conversionRate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lead Sources */}
          <Card className="p-6">
            <h2 className="text-xl mb-4">Lead Sources</h2>
            <div className="space-y-3">
              {Object.entries(leadSources).map(([source, count]: any) => {
                const percentage = ((count / filteredLeads.length) * 100).toFixed(1);
                return (
                  <div key={source}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{source}</span>
                      <span className="text-sm font-medium">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Lead Status Distribution */}
          <Card className="p-6">
            <h2 className="text-xl mb-4">Lead Status Distribution</h2>
            <div className="space-y-3">
              {Object.entries(leadStatusCount).map(([status, count]: any) => {
                const percentage = ((count / filteredLeads.length) * 100).toFixed(1);
                const colors: any = {
                  'New': 'bg-blue-600',
                  'Contacted': 'bg-yellow-600',
                  'Qualified': 'bg-green-600',
                  'Converted': 'bg-purple-600',
                  'Lost': 'bg-red-600'
                };
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{status}</span>
                      <span className="text-sm font-medium">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`${colors[status] || 'bg-slate-600'} h-2 rounded-full transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Leads Over Time */}
        <Card className="p-6">
          <h2 className="text-xl mb-4">Leads Over Time</h2>
          <div className="space-y-2">
            {Object.entries(leadsOverTime).slice(-14).map(([date, count]: any) => (
              <div key={date} className="flex items-center gap-3">
                <span className="text-sm text-slate-600 w-24">{date}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-6 relative">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-6 rounded-full flex items-center justify-end px-3"
                    style={{ width: `${(count / Math.max(...Object.values(leadsOverTime))) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
