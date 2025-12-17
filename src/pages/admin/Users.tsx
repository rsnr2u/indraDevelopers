import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getData, setData, addItem, deleteItem } from '../../utils/localStorage';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Checkbox } from '../../components/ui/checkbox';

export function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'user' | 'role'>('user');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const loadData = useCallback(async () => {
    try {
      const usersData = await getData('users');
      setUsers(Array.isArray(usersData) ? usersData : []);

      const rolesData = await getData('roles');
      setRoles(Array.isArray(rolesData) ? rolesData : []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load users and roles');
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveUser = () => {
    if (!formData.name || !formData.email || !formData.role) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!editingItem && !formData.password) {
      toast.error('Please enter a password');
      return;
    }

    if (editingItem) {
      const updated = users.map(user =>
        user.id === editingItem.id ? { ...user, ...formData } : user
      );
      setData('users', updated);
      toast.success('User updated successfully!');
    } else {
      addItem('users', formData);
      toast.success('User created successfully!');
    }

    loadData();
    setIsDialogOpen(false);
    setFormData({});
    setEditingItem(null);
  };

  const handleSaveRole = () => {
    if (!formData.name) {
      toast.error('Please enter role name');
      return;
    }

    if (editingItem) {
      const updated = roles.map(role =>
        role.id === editingItem.id ? { ...role, ...formData } : role
      );
      setData('roles', updated);
      toast.success('Role updated successfully!');
    } else {
      addItem('roles', { ...formData, permissions: formData.permissions || [] });
      toast.success('Role created successfully!');
    }

    loadData();
    setIsDialogOpen(false);
    setFormData({});
    setEditingItem(null);
  };

  const handleDelete = (id: string, type: 'users' | 'roles') => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    deleteItem(type, id);
    loadData();
    toast.success('Item deleted successfully!');
  };

  const allPermissions = [
    'dashboard',
    'seo',
    'cms',
    'settings',
    'projects',
    'blog',
    'pages',
    'menus',
    'users',
    'leads',
    'gallery',
    'plot-management',
    'site-visits',
    'testimonials',
    'whatsapp-settings',
    'email-templates',
    'exit-intent',
    'lead-source',
    'auto-response',
    'analytics',
    'indexing-settings'
  ];

  const togglePermission = (permission: string) => {
    const permissions = formData.permissions || [];
    if (permissions.includes(permission)) {
      setFormData({
        ...formData,
        permissions: permissions.filter((p: string) => p !== permission)
      });
    } else {
      setFormData({
        ...formData,
        permissions: [...permissions, permission]
      });
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl mb-6">User Management</h1>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl">Users</h2>
                <Button onClick={() => {
                  setDialogType('user');
                  setEditingItem(null);
                  setFormData({});
                  setIsDialogOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>

              <div className="space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p>{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500 mt-1">Role: {user.role}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setDialogType('user');
                          setEditingItem(user);
                          setFormData(user);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(user.id, 'users')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="roles">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl">Roles & Permissions</h2>
                <Button onClick={() => {
                  setDialogType('role');
                  setEditingItem(null);
                  setFormData({});
                  setIsDialogOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Role
                </Button>
              </div>

              <div className="space-y-4">
                {roles.map((role) => (
                  <div key={role.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-lg">{role.name}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Permissions: {role.permissions.includes('all') ? 'All' : role.permissions.join(', ')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setDialogType('role');
                            setEditingItem(role);
                            setFormData(role);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(role.id, 'roles')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog for Adding/Editing */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit' : 'Add'} {dialogType === 'user' ? 'User' : 'Role'}
            </DialogTitle>
            <DialogDescription>
              {dialogType === 'user' ? 'Manage user accounts and their access levels' : 'Define roles and their permissions'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {dialogType === 'user' ? (
              <>
                <div>
                  <Label>Name</Label>
                  <Input
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Password {editingItem && '(leave blank to keep current)'}</Label>
                  <Input
                    type="password"
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Role</Label>
                  <select
                    value={formData.role || ''}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Select Role</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                </div>

                <Button onClick={handleSaveUser} className="w-full">
                  Save User
                </Button>
              </>
            ) : (
              <>
                <div>
                  <Label>Role Name</Label>
                  <Input
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Permissions</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="all"
                        checked={(formData.permissions || []).includes('all')}
                        onCheckedChange={() => {
                          if ((formData.permissions || []).includes('all')) {
                            setFormData({ ...formData, permissions: [] });
                          } else {
                            setFormData({ ...formData, permissions: ['all'] });
                          }
                        }}
                      />
                      <label htmlFor="all" className="text-sm cursor-pointer">
                        All Permissions
                      </label>
                    </div>

                    {!(formData.permissions || []).includes('all') && allPermissions.map(permission => (
                      <div key={permission} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission}
                          checked={(formData.permissions || []).includes(permission)}
                          onCheckedChange={() => togglePermission(permission)}
                        />
                        <label htmlFor={permission} className="text-sm cursor-pointer capitalize">
                          {permission}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={handleSaveRole} className="w-full">
                  Save Role
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}