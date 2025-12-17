import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { getData, setData } from '../../utils/localStorage';
import { toast } from 'sonner';
import { Search, Globe, CheckCircle, XCircle, Send } from 'lucide-react';

export function IndexingSettings() {
  const [pages, setPages] = useState<any[]>([]);
  const [filteredPages, setFilteredPages] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPages, setSelectedPages] = useState<string[]>([]);

  const loadPages = async () => {
    const customPages = await getData('customPages') || [];

    // Default system pages
    const systemPages = [
      { id: 'home', pageName: 'Home Page', pageTitle: 'Home', slug: '', seo: { index: true }, status: 'Published', isSystem: true },
      { id: 'projects', pageName: 'Projects Listing', pageTitle: 'Projects', slug: 'projects', seo: { index: true }, status: 'Published', isSystem: true },
      { id: 'blog', pageName: 'Blog Listing', pageTitle: 'Blog', slug: 'blog', seo: { index: true }, status: 'Published', isSystem: true },
      { id: 'contact', pageName: 'Contact Page', pageTitle: 'Contact Us', slug: 'contact', seo: { index: true }, status: 'Published', isSystem: true },
      { id: 'about', pageName: 'About Page', pageTitle: 'About Us', slug: 'about', seo: { index: true }, status: 'Published', isSystem: true },
      { id: 'gallery', pageName: 'Gallery Page', pageTitle: 'Gallery', slug: 'gallery', seo: { index: true }, status: 'Published', isSystem: true },
    ];

    const allPages = [...systemPages, ...(Array.isArray(customPages) ? customPages : [])];
    setPages(allPages);
    setFilteredPages(allPages);
  };

  useEffect(() => {
    loadPages();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredPages(
        pages.filter(page =>
          page.pageTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          page.slug.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredPages(pages);
    }
  }, [searchTerm, pages]);



  const togglePageSelection = (pageId: string) => {
    if (selectedPages.includes(pageId)) {
      setSelectedPages(selectedPages.filter(id => id !== pageId));
    } else {
      setSelectedPages([...selectedPages, pageId]);
    }
  };

  const toggleAllPages = () => {
    if (selectedPages.length === filteredPages.length) {
      setSelectedPages([]);
    } else {
      setSelectedPages(filteredPages.map(p => p.id));
    }
  };

  const toggleIndexStatus = async (pageId: string, currentStatus: boolean) => {
    const customPages = await getData('customPages') || [];
    const updated = (Array.isArray(customPages) ? customPages : []).map((p: any) => {
      if (p.id === pageId) {
        return {
          ...p,
          seo: {
            ...p.seo,
            index: !currentStatus
          }
        };
      }
      return p;
    });
    setData('customPages', updated);
    loadPages();
    toast.success(`Page ${!currentStatus ? 'indexed' : 'no-indexed'} successfully!`);
  };

  const handleBulkSubmit = () => {
    if (selectedPages.length === 0) {
      toast.error('Please select at least one page to submit');
      return;
    }

    // Simulate submission to search engines
    toast.success(`${selectedPages.length} page(s) submitted to search engines for indexing!`, {
      description: 'This is a simulation. In production, this would submit to Google Search Console, Bing Webmaster Tools, etc.'
    });

    setSelectedPages([]);
  };

  const stats = {
    total: pages.length,
    indexed: pages.filter(p => p.seo?.index !== false).length,
    notIndexed: pages.filter(p => p.seo?.index === false).length,
    published: pages.filter(p => p.status === 'Published').length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl mb-2">Indexing Settings</h1>
          <p className="text-slate-600">
            Manage search engine indexing for all pages and submit them for crawling
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-slate-600">Total Pages</p>
            </div>
            <p className="text-2xl">{stats.total}</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <p className="text-sm text-slate-600">Indexed</p>
            </div>
            <p className="text-2xl text-green-600">{stats.indexed}</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <p className="text-sm text-slate-600">No-Index</p>
            </div>
            <p className="text-2xl text-red-600">{stats.notIndexed}</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-purple-600" />
              <p className="text-sm text-slate-600">Published</p>
            </div>
            <p className="text-2xl text-purple-600">{stats.published}</p>
          </Card>
        </div>

        {/* Search and Bulk Actions */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search pages by title or slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button
              onClick={handleBulkSubmit}
              disabled={selectedPages.length === 0}
              className="whitespace-nowrap"
            >
              <Send className="h-4 w-4 mr-2" />
              Bulk Submit ({selectedPages.length})
            </Button>
          </div>
        </Card>

        {/* Pages Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left p-4">
                    <input
                      type="checkbox"
                      checked={selectedPages.length === filteredPages.length && filteredPages.length > 0}
                      onChange={toggleAllPages}
                      className="h-4 w-4"
                    />
                  </th>
                  <th className="text-left p-4">Page Title</th>
                  <th className="text-left p-4">URL</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Indexing</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPages.map((page) => {
                  const isIndexed = page.seo?.index !== false;
                  const url = page.slug ? `/${page.slug}` : '/';

                  return (
                    <tr key={page.id} className="border-b hover:bg-slate-50">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedPages.includes(page.id)}
                          onChange={() => togglePageSelection(page.id)}
                          className="h-4 w-4"
                        />
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{page.pageTitle}</p>
                          <p className="text-sm text-slate-600">{page.pageName}</p>
                          {page.isSystem && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                              System Page
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {url}
                        </a>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${page.status === 'Published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                          }`}>
                          {page.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {isIndexed ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className={`text-sm ${isIndexed ? 'text-green-700' : 'text-red-700'}`}>
                            {isIndexed ? 'Index, Follow' : 'No-Index, No-Follow'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        {!page.isSystem && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleIndexStatus(page.id, isIndexed)}
                          >
                            {isIndexed ? 'No-Index' : 'Index'}
                          </Button>
                        )}
                        {page.isSystem && (
                          <span className="text-sm text-slate-400">
                            System Default
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredPages.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              {searchTerm ? 'No pages found matching your search' : 'No pages available'}
            </div>
          )}
        </Card>

        {/* Information */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            About Search Engine Indexing
          </h3>
          <div className="text-sm text-slate-700 space-y-2">
            <p>
              <strong>Index, Follow:</strong> Page will be indexed by search engines and links will be followed.
            </p>
            <p>
              <strong>No-Index, No-Follow:</strong> Page will NOT be indexed and links will NOT be followed.
            </p>
            <p className="text-slate-600 mt-4">
              <strong>Note:</strong> Bulk submit will send selected pages to search engines for crawling and indexing.
              In production, this integrates with Google Search Console, Bing Webmaster Tools, and other search engine APIs.
            </p>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
