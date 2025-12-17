import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getData, setData, addItem } from '../../utils/localStorage';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { toast } from 'sonner';
import { ArrowLeft, Shield, Save } from 'lucide-react';

export function RoleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>({
    name: '',
    description: '',
    permissions: [],
    modulePermissions: {}
  });

  const modules = [
    { id: 'dashboard', name: 'Dashboard', description: 'View dashboard and analytics', icon: '📊' },
    { id: 'projects', name: 'Projects', description: 'Manage real estate projects', icon: '🏗️' },
    { id: 'blog', name: 'Blog', description: 'Create and manage blog posts', icon: '📝' },
    { id: 'pages', name: 'Pages', description: 'Manage website pages', icon: '📄' },
    { id: 'leads', name: 'Leads', description: 'View and manage leads', icon: '👥' },
    { id: 'cms', name: 'CMS', description: 'Manage website content', icon: '🎨' },
    { id: 'seo', name: 'SEO', description: 'Manage SEO settings', icon: '🔍' },
    { id: 'menus', name: 'Menus', description: 'Configure navigation menus', icon: '📋' },
    { id: 'users', name: 'Users', description: 'Manage users and roles', icon: '👤' },
    { id: 'settings', name: 'Settings', description: 'Website settings and configuration', icon: '⚙️' }
  ];

  const permissions = [
    { id: 'view', name: 'View', description: 'Can view the module' },
    { id: 'create', name: 'Create', description: 'Can create new items' },
    { id: 'edit', name: 'Edit', description: 'Can edit existing items' },
    { id: 'delete', name: 'Delete', description: 'Can delete items' }
  ];

  useEffect(() => {
    if (id && id !== 'new') {
      const roles = getData('roles') || [];
      const role = roles.find((r: any) => r.id === id);
      if (role) {
        setFormData(role);
      }
    } else {
      // Initialize with empty permissions for each module
      const initialPerms: any = {};
      modules.forEach(module => {
        initialPerms[module.id] = {
          view: false,
          create: false,
          edit: false,
          delete: false
        };
      });
      setFormData({
        name: '',
        description: '',
        permissions: [],
        modulePermissions: initialPerms
      });
    }
  }, [id]);

  const toggleAllPermissions = (checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, permissions: ['all'] });
    } else {
      setFormData({ ...formData, permissions: [] });
    }
  };

  const toggleModulePermission = (moduleId: string, permId: string, checked: boolean) => {
    const updatedModulePerms = {
      ...formData.modulePermissions,
      [moduleId]: {
        ...formData.modulePermissions[moduleId],
        [permId]: checked
      }
    };
    setFormData({
      ...formData,
      modulePermissions: updatedModulePerms
    });
  };

  const setModuleFullAccess = (moduleId: string, checked: boolean) => {
    const updatedModulePerms = {
      ...formData.modulePermissions,
      [moduleId]: {
        view: checked,
        create: checked,
        edit: checked,
        delete: checked
      }
    };
    setFormData({
      ...formData,
      modulePermissions: updatedModulePerms
    });
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a role name');
      return;
    }

    if (id && id !== 'new') {
      // Update existing role
      const roles = getData('roles') || [];
      const updated = roles.map((r: any) =>
        r.id === id ? { ...r, ...formData } : r
      );
      setData('roles', updated);
      toast.success('Role updated successfully!');
    } else {
      // Create new role
      addItem('roles', formData);
      toast.success('Role created successfully!');
    }

    navigate('/admin/roles');
  };

  const hasAllPermissions = formData.permissions?.includes('all');

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/roles')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl">
            {id === 'new' ? 'Create New Role' : 'Edit Role'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg">Role Information</h3>
                  <p className="text-sm text-gray-600">Basic details</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Role Name *</Label>
                  <Input
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Content Manager"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Input
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this role"
                  />
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="all-permissions"
                      checked={hasAllPermissions}
                      onCheckedChange={toggleAllPermissions}
                    />
                    <label htmlFor="all-permissions" className="text-sm font-medium cursor-pointer">
                      Grant All Permissions
                    </label>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    This role will have full access to all modules
                  </p>
                </div>

                <Button onClick={handleSave} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  {id === 'new' ? 'Create Role' : 'Update Role'}
                </Button>
              </div>
            </div>
          </div>

          {/* Module Permissions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg mb-6">Module Permissions</h3>

              {hasAllPermissions ? (
                <div className="text-center py-12 bg-blue-50 rounded-lg">
                  <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <p className="text-lg font-medium text-blue-900">Full Access Granted</p>
                  <p className="text-sm text-blue-700 mt-2">
                    This role has access to all modules with all permissions
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {modules.map((module) => {
                    const modulePerms = formData.modulePermissions?.[module.id] || {};
                    const allChecked = permissions.every(p => modulePerms[p.id]);
                    const someChecked = permissions.some(p => modulePerms[p.id]);

                    return (
                      <div key={module.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{module.icon}</span>
                            <div>
                              <h4 className="font-medium">{module.name}</h4>
                              <p className="text-sm text-gray-600">{module.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`${module.id}-all`}
                              checked={allChecked}
                              onCheckedChange={(checked) => setModuleFullAccess(module.id, checked as boolean)}
                            />
                            <label
                              htmlFor={`${module.id}-all`}
                              className="text-sm font-medium cursor-pointer"
                            >
                              Full Access
                            </label>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 ml-11">
                          {permissions.map((perm) => (
                            <div key={perm.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${module.id}-${perm.id}`}
                                checked={modulePerms[perm.id] || false}
                                onCheckedChange={(checked) =>
                                  toggleModulePermission(module.id, perm.id, checked as boolean)
                                }
                              />
                              <label
                                htmlFor={`${module.id}-${perm.id}`}
                                className="text-sm cursor-pointer"
                              >
                                {perm.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
