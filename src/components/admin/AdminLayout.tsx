import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LogOut, 
  LayoutDashboard, 
  Settings as SettingsIcon, 
  Globe,
  FileText,
  Layout,
  Users,
  Mail,
  Menu as MenuIcon,
  X,
  FileCode,
  FolderKanban,
  Image,
  MessageSquare,
  Star,
  Calendar,
  BarChart3,
  AlertTriangle,
  Send
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Projects', path: '/admin/projects', icon: FolderKanban },
    { label: 'Blog', path: '/admin/blog', icon: FileText },
    { label: 'Gallery', path: '/admin/gallery', icon: Image },
    { label: 'Pages', path: '/admin/pages', icon: Layout },
    { label: 'Leads', path: '/admin/leads', icon: Mail },
    { label: 'Site Visits', path: '/admin/site-visits', icon: Calendar },
    { label: 'Testimonials', path: '/admin/testimonials', icon: Star },
    { label: 'CMS', path: '/admin/cms', icon: FileCode },
    { label: 'SEO', path: '/admin/seo', icon: Globe },
    { label: 'Menus', path: '/admin/menus', icon: MenuIcon },
    { label: 'WhatsApp Widget', path: '/admin/whatsapp-widget', icon: MessageSquare },
    { label: 'Exit Intent', path: '/admin/exit-intent-settings', icon: AlertTriangle },
    { label: 'Email Templates', path: '/admin/email-templates', icon: Send },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Settings', path: '/admin/settings', icon: SettingsIcon }
  ];

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Fixed */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out overflow-hidden ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo and Brand */}
          <div className="px-4 py-3 border-b border-slate-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="text-sm font-semibold text-slate-900">Indra Developers</h1>
                  <p className="text-xs text-slate-500">Admin Panel</p>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-1 hover:bg-slate-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Navigation Menu - Scrollable */}
          <nav className="flex-1 overflow-y-auto py-3 px-3">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                      isActive(item.path)
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* User Profile & Actions - Fixed at bottom */}
          <div className="border-t border-slate-200 p-3 space-y-2 flex-shrink-0">
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
            >
              <Globe className="h-4 w-4 flex-shrink-0" />
              <span>View Website</span>
            </button>
            
            <button
              onClick={() => navigate('/admin/profile')}
              className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-md transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-xs">
                  {(currentUser.name || 'A').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs font-medium text-slate-900 truncate">{currentUser.name || 'Admin'}</p>
                  <p className="text-xs text-slate-500 truncate">{currentUser.role || 'Super Admin'}</p>
                </div>
              </div>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-slate-100 rounded-md"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded flex items-center justify-center">
                <LayoutDashboard className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm font-semibold">Indra Developers</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 px-4 lg:px-6 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-600">
            <p>© 2025 Indra Developers. All rights reserved.</p>
            <p>Admin Panel v1.0</p>
          </div>
        </footer>
      </div>
    </div>
  );
}