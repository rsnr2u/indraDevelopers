import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { initializeData } from './utils/localStorage';
import { ThemeProvider } from './contexts/ThemeContext';

import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { SEO } from './pages/admin/SEO';
import { CMS } from './pages/admin/CMS';
import { Settings } from './pages/admin/Settings';
import { Projects } from './pages/admin/Projects';
import { ProjectForm } from './pages/admin/ProjectForm';
import { Blog } from './pages/admin/Blog';
import { BlogPostForm } from './pages/admin/BlogPostForm';
import { Pages } from './pages/admin/Pages';
import { PageForm } from './pages/admin/PageForm';
import { Menus } from './pages/admin/Menus';
import { Users } from './pages/admin/Users';
import { Profile } from './pages/admin/Profile';
import { Leads } from './pages/admin/Leads';
import { LeadDetail } from './pages/admin/LeadDetail';
import { RoleManagement } from './pages/admin/RoleManagement';
import { RoleEditor } from './pages/admin/RoleEditor';
import { GalleryManagement } from './pages/admin/GalleryManagement';
import { GalleryForm } from './pages/admin/GalleryForm';
import { WhatsAppWidget } from './pages/admin/WhatsAppWidget';
import { Testimonials } from './pages/admin/Testimonials';
import { EmailTemplates } from './pages/admin/EmailTemplates';
import { SiteVisits } from './pages/admin/SiteVisits';
import { ScheduleVisit } from './pages/admin/ScheduleVisit';
import { Analytics } from './pages/admin/Analytics';
import { ExitIntentSettings } from './pages/admin/ExitIntentSettings';
import { IndexingSettings } from './pages/admin/IndexingSettings';

import { Home } from './pages/frontend/Home';
import { ProjectsList } from './pages/frontend/ProjectsList';
import { ProjectDetail } from './pages/frontend/ProjectDetail';
import { About } from './pages/frontend/About';
import { Contact } from './pages/frontend/Contact';
import { Gallery } from './pages/frontend/Gallery';
import { BlogList } from './pages/frontend/BlogList';
import { BlogPost } from './pages/frontend/BlogPost';
import { TrackLead } from './pages/frontend/TrackLead';

function App() {
  useEffect(() => {
    initializeData();
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsList />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/track-lead" element={<TrackLead />} />
          
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/seo" element={<SEO />} />
          <Route path="/admin/cms" element={<CMS />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/projects" element={<Projects />} />
          <Route path="/admin/projects/new" element={<ProjectForm />} />
          <Route path="/admin/projects/edit/:id" element={<ProjectForm />} />
          <Route path="/admin/blog" element={<Blog />} />
          <Route path="/admin/blog/new" element={<BlogPostForm />} />
          <Route path="/admin/blog/edit/:id" element={<BlogPostForm />} />
          <Route path="/admin/pages" element={<Pages />} />
          <Route path="/admin/pages/new" element={<PageForm />} />
          <Route path="/admin/pages/edit/:id" element={<PageForm />} />
          <Route path="/admin/menus" element={<Menus />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/profile" element={<Profile />} />
          <Route path="/admin/leads" element={<Leads />} />
          <Route path="/admin/leads/:id" element={<LeadDetail />} />
          <Route path="/admin/roles" element={<RoleManagement />} />
          <Route path="/admin/roles/new" element={<RoleEditor />} />
          <Route path="/admin/roles/:id" element={<RoleEditor />} />
          <Route path="/admin/roles/:id/edit" element={<RoleEditor />} />
          <Route path="/admin/gallery" element={<GalleryManagement />} />
          <Route path="/admin/gallery/new" element={<GalleryForm />} />
          <Route path="/admin/gallery/:id" element={<GalleryForm />} />
          <Route path="/admin/whatsapp-widget" element={<WhatsAppWidget />} />
          <Route path="/admin/testimonials" element={<Testimonials />} />
          <Route path="/admin/email-templates" element={<EmailTemplates />} />
          <Route path="/admin/site-visits" element={<SiteVisits />} />
          <Route path="/admin/schedule-visit" element={<ScheduleVisit />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/exit-intent-settings" element={<ExitIntentSettings />} />
          <Route path="/admin/indexing-settings" element={<IndexingSettings />} />
          
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;