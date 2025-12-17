import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addItem, initializeData } from '../../utils/localStorage';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner';
import { Building2, Home, Key, TrendingUp, Eye, EyeOff, Facebook, Mail } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  // Ensure localStorage is initialized
  useEffect(() => {
    try {
      initializeData();
    } catch (error) {
      console.error('Failed to initialize login data:', error);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate loading for better UX
      await new Promise(resolve => setTimeout(resolve, 500));

      const result = await addItem('auth/login', {
        email: formData.email,
        password: formData.password
      });

      if (result && result.user) {
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        toast.success('Welcome back! Login successful.');
        navigate('/admin/dashboard');
      } else {
        toast.error('Invalid email or password. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      {/* Left Side - Branding & Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-blue-700 to-purple-800 relative overflow-hidden p-12 flex-col justify-between">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Floating Shapes */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/30">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl text-white">Indra Developers</span>
          </div>
        </div>

        {/* Center Illustration & Text */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1">
          {/* Real Estate Illustration */}
          <div className="mb-8 relative">
            {/* Main Building Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-2xl opacity-50 scale-110"></div>
              <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border-2 border-white/20 shadow-2xl">
                <div className="relative">
                  <Home className="h-32 w-32 text-white" strokeWidth={1.5} />

                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-3 shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
                    <Key className="h-6 w-6 text-white" />
                  </div>

                  <div className="absolute -bottom-2 -left-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-2.5 shadow-lg animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Sparkle Effects */}
            <div className="absolute -top-8 left-1/4 animate-pulse">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <div className="absolute -top-4 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}>
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <div className="absolute top-1/4 -right-8 animate-pulse" style={{ animationDelay: '1s' }}>
              <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Tagline */}
          <div className="text-center max-w-md">
            <h2 className="text-3xl text-white mb-4">Your Gateway to Dream Properties</h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              Manage properties, track leads, and grow your real estate business with powerful insights and seamless tools.
            </p>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="relative z-10 text-center">
          <p className="text-blue-200 text-sm">© 2024 Indra Developers. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="h-12 w-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Building2 className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Indra Developers
            </span>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl text-slate-900 mb-2">Log in</h1>
              <p className="text-slate-500">Welcome back! Please enter your details</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm text-slate-700 mb-2">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  className="h-12 border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter your password"
                    className="h-12 pr-11 border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Logging in...
                  </span>
                ) : (
                  'Log in'
                )}
              </Button>
            </form>

            {/* Forgot Password */}
            <div className="text-right mt-4">
              <button
                type="button"
                className="text-sm text-teal-600 hover:text-teal-700 hover:underline transition-colors"
              >
                Forgotten password
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">or log in with</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-4 gap-3">
              <button
                type="button"
                className="h-12 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center transition-all hover:shadow-md group"
              >
                <Facebook className="h-5 w-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
              </button>
              <button
                type="button"
                className="h-12 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center transition-all hover:shadow-md group"
              >
                <svg className="h-5 w-5 text-slate-600 group-hover:text-red-500 transition-colors" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                </svg>
              </button>
              <button
                type="button"
                className="h-12 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center transition-all hover:shadow-md group"
              >
                <svg className="h-5 w-5 text-slate-600 group-hover:text-blue-400 transition-colors" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.46,6c-0.77,0.35-1.6,0.58-2.46,0.69c0.88-0.53,1.56-1.37,1.88-2.38c-0.83,0.5-1.75,0.85-2.72,1.05C18.37,4.5,17.26,4,16,4c-2.35,0-4.27,1.92-4.27,4.29c0,0.34,0.04,0.67,0.11,0.98C8.28,9.09,5.11,7.38,3,4.79c-0.37,0.63-0.58,1.37-0.58,2.15c0,1.49,0.75,2.81,1.91,3.56c-0.71,0-1.37-0.2-1.95-0.5c0,0.01,0,0.02,0,0.03c0,2.08,1.48,3.82,3.44,4.21c-0.36,0.1-0.74,0.15-1.13,0.15c-0.27,0-0.54-0.03-0.8-0.08c0.54,1.69,2.11,2.95,4,2.98c-1.46,1.16-3.31,1.84-5.33,1.84c-0.34,0-0.68-0.02-1.02-0.06C3.44,20.29,5.7,21,8.12,21C16,21,20.33,14.46,20.33,8.79c0-0.19,0-0.37-0.01-0.56C21.38,7.89,22,7,22.46,6z" />
                </svg>
              </button>
              <button
                type="button"
                className="h-12 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center transition-all hover:shadow-md group"
              >
                <svg className="h-5 w-5 text-slate-600 group-hover:text-slate-900 transition-colors" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
              </button>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowDemo(!showDemo)}
                className="w-full text-sm text-teal-600 hover:text-teal-700 py-2 hover:underline transition-colors"
              >
                {showDemo ? 'Hide' : 'Show'} Demo Credentials
              </button>

              {showDemo && (
                <div className="mt-3 space-y-2 animate-in fade-in duration-200">
                  <button
                    type="button"
                    onClick={() => setFormData({ email: 'superadmin@indradevelopers.com', password: 'admin123' })}
                    className="w-full p-3 bg-purple-50 rounded-lg border border-purple-200 hover:border-purple-400 hover:shadow-sm transition-all text-left text-sm"
                  >
                    <p className="text-purple-600 mb-0.5">Super Admin</p>
                    <p className="text-slate-600 text-xs">superadmin@indradevelopers.com / admin123</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ email: 'admin@indradevelopers.com', password: 'admin123' })}
                    className="w-full p-3 bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-sm transition-all text-left text-sm"
                  >
                    <p className="text-blue-600 mb-0.5">Admin</p>
                    <p className="text-slate-600 text-xs">admin@indradevelopers.com / admin123</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ email: 'staff@indradevelopers.com', password: 'staff123' })}
                    className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-400 hover:shadow-sm transition-all text-left text-sm"
                  >
                    <p className="text-slate-600 mb-0.5">Staff</p>
                    <p className="text-slate-600 text-xs">staff@indradevelopers.com / staff123</p>
                  </button>
                </div>
              )}
            </div>

            {/* Sign Up Link */}
            <div className="text-center mt-6 pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                Need an account?{' '}
                <button
                  type="button"
                  className="text-teal-600 hover:text-teal-700 hover:underline transition-colors"
                >
                  Sign up
                </button>
              </p>
            </div>

            {/* Back to Website */}
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                ← Back to Website
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
