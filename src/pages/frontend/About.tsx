import { useEffect, useState } from 'react';
import { getData } from '../../utils/localStorage';
import { Header } from '../../components/frontend/Header';
import { Footer } from '../../components/frontend/Footer';
import { Target, Eye } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function About() {
  const { colors } = useTheme();
  const [aboutData, setAboutData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const cmsPages = await getData('cmsPages');
      if (cmsPages?.about) {
        setAboutData(cmsPages.about);
      }
    };
    loadData();
  }, []);

  if (!aboutData) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1">
        {/* Page Header */}
        <div
          className="text-white py-16"
          style={{ background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})` }}
        >
          <div className="container mx-auto px-4">
            <h1 className="text-4xl mb-4">{aboutData.title}</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: aboutData.content }}
              />
            </div>

            {aboutData.image && (
              <div>
                <img
                  src={aboutData.image}
                  alt="About Us"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>

          {/* Vision & Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <Eye className="h-12 w-12 mb-4" style={{ color: colors.primaryColor }} />
              <h3 className="text-2xl mb-4" style={{ color: colors.textColor }}>Our Vision</h3>
              <p className="text-gray-600">{aboutData.vision}</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <Target className="h-12 w-12 mb-4" style={{ color: colors.accentColor }} />
              <h3 className="text-2xl mb-4" style={{ color: colors.textColor }}>Our Mission</h3>
              <p className="text-gray-600">{aboutData.mission}</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}