import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getData, setData, addItem, deleteItem } from '../../utils/localStorage';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { Plus, Eye, Pencil, Trash2, Shield, ArrowLeft } from 'lucide-react';

export function RoleManagement() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<any[]>([]);

  const loadData = async () => {
    const rolesData = await getData('roles');
    setRoles(Array.isArray(rolesData) ? rolesData : []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this role?')) return;
    deleteItem('roles', id);
    loadData();
    toast.success('Role deleted successfully!');
  };

  const modules = [
    { id: 'dashboard', name: 'Dashboard', description: 'View dashboard and analytics' },
    { id: 'projects', name: 'Projects', description: 'Manage real estate projects' },
    { id: 'blog', name: 'Blog', description: 'Create and manage blog posts' },
    { id: 'pages', name: 'Pages', description: 'Manage website pages' },
    { id: 'leads', name: 'Leads', description: 'View and manage leads' },
    { id: 'cms', name: 'CMS', description: 'Manage website content' },
    { id: 'seo', name: 'SEO', description: 'Manage SEO settings' },
    { id: 'menus', name: 'Menus', description: 'Configure navigation menus' },
    { id: 'users', name: 'Users', description: 'Manage users and roles' },
    { id: 'settings', name: 'Settings', description: 'Website settings and configuration' }
  ];

  const getPermissionLabel = (role: any, moduleId: string) => {
    if (role.permissions?.includes('all')) return 'Full Access';

    const modulePerms = role.modulePermissions?.[moduleId];
    if (!modulePerms) return 'No Access';

    const perms = [];
    if (modulePerms.view) perms.push('View');
    if (modulePerms.create) perms.push('Create');
    if (modulePerms.edit) perms.push('Edit');
    if (modulePerms.delete) perms.push('Delete');

    return perms.length > 0 ? perms.join(', ') : 'No Access';
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/users')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
            <h1 className="text-3xl">Role Management</h1>
          </div>
          <Button onClick={() => navigate('/admin/roles/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Role
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {roles.map((role) => (
            <div key={role.id} className="bg-white rounded-lg border overflow-hidden">
              <div className="p-6 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl">{role.name}</h3>
                      <p className="text-sm text-gray-600">
                        {role.permissions?.includes('all')
                          ? 'All Permissions'
                          : `Custom Permissions`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/roles/${role.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/roles/${role.id}/edit`)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(role.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h4 className="font-medium mb-4">Module Permissions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {modules.map((module) => (
                    <div key={module.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{module.name}</p>
                          <p className="text-xs text-gray-600">{module.description}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {getPermissionLabel(role, module.id)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {roles.length === 0 && (
            <div className="bg-white rounded-lg border p-12 text-center">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No roles created yet</p>
              <Button onClick={() => navigate('/admin/roles/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Role
              </Button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
