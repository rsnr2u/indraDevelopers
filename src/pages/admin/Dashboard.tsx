import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getData } from '../../utils/localStorage';
import { Building2, Users, FileText, Mail } from 'lucide-react';
import { Card } from '../../components/ui/card';

export function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    leads: 0,
    blogPosts: 0,
    users: 0,
    availablePlots: 0,
    bookedPlots: 0,
    blockedPlots: 0
  });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);

  useEffect(() => {
    const loadStats = async () => {
      const projects = await getData('projects') || [];
      const leads = await getData('leads') || [];
      const blogPosts = await getData('blogPosts') || [];
      const users = await getData('users') || [];

      let availablePlots = 0;
      let bookedPlots = 0;
      let blockedPlots = 0;

      projects.forEach((project: any) => {
        project.plots?.forEach((plot: any) => {
          if (plot.status.toLowerCase() === 'available') availablePlots++;
          else if (plot.status.toLowerCase() === 'booked') bookedPlots++;
          else if (plot.status.toLowerCase() === 'blocked') blockedPlots++;
        });
      });

      setStats({
        projects: projects.length,
        leads: leads.length,
        blogPosts: blogPosts.length,
        users: users.length,
        availablePlots,
        bookedPlots,
        blockedPlots
      });
      setRecentLeads(leads.slice(0, 5));
      setRecentPosts(blogPosts.slice(0, 5));
    };
    loadStats();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Overview of your real estate management system</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Projects</p>
                <p className="text-3xl mt-2">{stats.projects}</p>
              </div>
              <Building2 className="h-10 w-10 text-blue-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-3xl mt-2">{stats.leads}</p>
              </div>
              <Mail className="h-10 w-10 text-green-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Blog Posts</p>
                <p className="text-3xl mt-2">{stats.blogPosts}</p>
              </div>
              <FileText className="h-10 w-10 text-purple-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Users</p>
                <p className="text-3xl mt-2">{stats.users}</p>
              </div>
              <Users className="h-10 w-10 text-orange-500" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-green-50 border-green-200">
            <p className="text-sm text-green-700">Available Plots</p>
            <p className="text-3xl text-green-700 mt-2">{stats.availablePlots}</p>
          </Card>

          <Card className="p-4 bg-red-50 border-red-200">
            <p className="text-sm text-red-700">Booked Plots</p>
            <p className="text-3xl text-red-700 mt-2">{stats.bookedPlots}</p>
          </Card>

          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <p className="text-sm text-yellow-700">Blocked Plots</p>
            <p className="text-3xl text-yellow-700 mt-2">{stats.blockedPlots}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-4">
            <h2 className="text-xl mb-3">Recent Leads</h2>
            <div className="space-y-2">
              {recentLeads.map((lead: any) => (
                <div key={lead.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <p>{lead.name}</p>
                    <p className="text-sm text-gray-600">{lead.projectInterest}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${lead.status === 'New' ? 'bg-blue-100 text-blue-700' :
                    lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-700' :
                      lead.status === 'Qualified' ? 'bg-purple-100 text-purple-700' :
                        'bg-green-100 text-green-700'
                    }`}>
                    {lead.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-xl mb-3">Recent Blog Posts</h2>
            <div className="space-y-2">
              {recentPosts.map((post: any) => (
                <div key={post.id} className="p-2 bg-gray-50 rounded">
                  <p>{post.title}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(post.publishDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
