import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getData } from '../../utils/localStorage';
import { Header } from '../../components/frontend/Header';
import { Footer } from '../../components/frontend/Footer';
import { Building2, MapPin, Filter, Search } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { useTheme } from '../../contexts/ThemeContext';

export function ProjectsList() {
  const { colors } = useTheme();
  const [projects, setProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProjectsData = async () => {
      const [projectsData, categoriesData, locationsData] = await Promise.all([
        getData('projects'),
        getData('projectCategories'),
        getData('locations')
      ]);
      setProjects(projectsData || []);
      setCategories(categoriesData || []);
      setLocations(locationsData || []);
    };
    fetchProjectsData();
  }, []);

  const filteredProjects = projects.filter(project => {
    if (project.status !== 'Active') return false;
    if (selectedCategory !== 'all' && project.categoryId !== selectedCategory) return false;
    if (selectedLocation !== 'all' && project.locationId !== selectedLocation) return false;
    if (searchQuery && !project.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <div className="flex-1">
        {/* Page Header */}
        <div
          className="relative text-white py-24 overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor}, ${colors.accentColor})` }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 -left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 -right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="container relative z-10">
            <h1 className="text-5xl md:text-6xl mb-4">Our Projects</h1>
            <p className="text-xl text-white/90 max-w-2xl">Explore our premium real estate projects designed for modern living</p>
          </div>
        </div>

        <div className="container py-12">
          {/* Filters */}
          <Card className="p-6 mb-8 border-slate-200 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5" style={{ color: colors.primaryColor }} />
              <h2 className="text-xl" style={{ color: colors.textColor }}>Filter Projects</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-2 text-slate-700">Search Projects</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name..."
                    className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none transition-all"
                    style={{
                      borderColor: '#cbd5e1'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = colors.primaryColor;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primaryColor}20`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#cbd5e1';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 text-slate-700">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none transition-all"
                  style={{
                    borderColor: '#cbd5e1'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.primaryColor;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primaryColor}20`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2 text-slate-700">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none transition-all"
                  style={{
                    borderColor: '#cbd5e1'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.primaryColor;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primaryColor}20`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <option value="all">All Locations</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {(selectedCategory !== 'all' || selectedLocation !== 'all' || searchQuery) && (
              <div className="mt-4 flex items-center gap-3">
                <span className="text-sm text-slate-600">Active filters:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedLocation('all');
                    setSearchQuery('');
                  }}
                  className="h-8 text-xs"
                >
                  Clear All
                </Button>
              </div>
            )}
          </Card>

          {/* Results Count */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-slate-600">
              Showing <span className="text-slate-900">{filteredProjects.length}</span> {filteredProjects.length === 1 ? 'project' : 'projects'}
            </p>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 border"
                  style={{ borderColor: '#e2e8f0' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = colors.primaryColor}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                  <div className="relative overflow-hidden h-56">
                    {project.featuredImage ? (
                      <img
                        src={project.featuredImage}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.accentColor})` }}
                      >
                        <Building2 className="h-20 w-20 text-white opacity-30" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <div className="px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full text-sm text-slate-900 shadow-lg">
                        {project.plots?.filter((p: any) => p.status === 'Available').length || 0} Available
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3
                      className="text-2xl mb-3 transition-colors"
                      style={{ color: colors.textColor }}
                      onMouseEnter={(e) => e.currentTarget.style.color = colors.primaryColor}
                      onMouseLeave={(e) => e.currentTarget.style.color = colors.textColor}
                    >{project.name}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Building2 className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm">{categories.find(c => c.id === project.categoryId)?.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm">{locations.find(l => l.id === project.locationId)?.name}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-xl text-green-600">
                          {project.plots?.filter((p: any) => p.status === 'Available').length || 0}
                        </div>
                        <div className="text-xs text-slate-600 mt-1">Available</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-xl text-red-600">
                          {project.plots?.filter((p: any) => p.status === 'Booked').length || 0}
                        </div>
                        <div className="text-xs text-slate-600 mt-1">Booked</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-xl text-yellow-600">
                          {project.plots?.filter((p: any) => p.status === 'Blocked').length || 0}
                        </div>
                        <div className="text-xs text-slate-600 mt-1">Blocked</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="p-16 text-center border-slate-200">
              <Building2 className="h-24 w-24 mx-auto mb-6 text-slate-300" />
              <h3 className="text-2xl mb-2" style={{ color: colors.textColor }}>No projects found</h3>
              <p className="text-slate-600 mb-6">We couldn't find any projects matching your criteria</p>
              <Button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedLocation('all');
                  setSearchQuery('');
                }}
                className="text-white"
                style={{ backgroundColor: colors.primaryColor }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Clear Filters
              </Button>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}