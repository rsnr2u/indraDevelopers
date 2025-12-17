import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getData, setData } from '../../utils/localStorage';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { toast } from 'sonner';
import { User, Lock, Mail, Shield, Save, KeyRound } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

export function Profile() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    role: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      navigate('/admin/login');
      return;
    }

    const user = JSON.parse(userStr);
    setCurrentUser(user);
    setProfileData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || ''
    });
  }, [navigate]);

  const handleUpdateProfile = async () => {
    if (!profileData.name || !profileData.email) {
      toast.error('Name and email are required');
      return;
    }

    try {
      const users = await getData('users') || [];
      const updatedUsers = users.map((user: any) => {
        if (user.id === currentUser.id) {
          return {
            ...user,
            name: profileData.name,
            email: profileData.email
          };
        }
        return user;
      });

      setData('users', updatedUsers);

      // Update current user in localStorage
      const updatedCurrentUser = {
        ...currentUser,
        name: profileData.name,
        email: profileData.email
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
      setCurrentUser(updatedCurrentUser);

      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('All password fields are required');
      return;
    }

    if (passwordData.currentPassword !== currentUser.password) {
      toast.error('Current password is incorrect');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      const users = await getData('users') || [];
      const updatedUsers = users.map((user: any) => {
        if (user.id === currentUser.id) {
          return {
            ...user,
            password: passwordData.newPassword
          };
        }
        return user;
      });

      setData('users', updatedUsers);

      // Update current user password
      const updatedCurrentUser = {
        ...currentUser,
        password: passwordData.newPassword
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
      setCurrentUser(updatedCurrentUser);

      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      toast.success('Password changed successfully!');
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl">Profile Settings</h1>
          <p className="text-slate-600 mt-2">Manage your account settings and security</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="p-6">
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="flex items-center gap-6 pb-6 border-b">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl shadow-lg">
                    {profileData.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl mb-1">{profileData.name}</h2>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm">{profileData.role}</span>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="space-y-5">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative mt-2">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        placeholder="Enter your full name"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        placeholder="Enter your email"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="role">Role</Label>
                    <div className="relative mt-2">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="role"
                        value={profileData.role}
                        disabled
                        className="pl-10 bg-slate-50 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Role cannot be changed. Contact administrator for role changes.</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button onClick={handleUpdateProfile} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="p-6">
              <div className="space-y-6">
                {/* Security Header */}
                <div className="pb-6 border-b">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                      <Lock className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-xl">Change Password</h2>
                      <p className="text-sm text-slate-600">Update your password to keep your account secure</p>
                    </div>
                  </div>
                </div>

                {/* Password Form */}
                <div className="space-y-5">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative mt-2">
                      <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        placeholder="Enter current password"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        placeholder="Enter new password"
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Password must be at least 6 characters long</p>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        placeholder="Confirm new password"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Password Strength Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">Password Security Tips:</h3>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Use at least 6 characters (longer is better)</li>
                    <li>• Mix uppercase and lowercase letters</li>
                    <li>• Include numbers and special characters</li>
                    <li>• Avoid common words or personal information</li>
                    <li>• Don't reuse passwords from other accounts</li>
                  </ul>
                </div>

                <div className="pt-4 border-t">
                  <Button onClick={handleChangePassword} className="w-full bg-red-600 hover:bg-red-700">
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Account Info Card */}
        <Card className="p-6 mt-6">
          <h3 className="text-lg mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-slate-600">User ID:</span>
              <span className="font-mono text-slate-900">{currentUser.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-slate-600">Account Status:</span>
              <span className="text-green-600 font-medium">Active</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-slate-600">Role:</span>
              <span className="font-medium text-slate-900">{currentUser.role}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-slate-600">Last Login:</span>
              <span className="text-slate-900">Just now</span>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
