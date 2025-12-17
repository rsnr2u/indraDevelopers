<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class InitialSeeder extends Seeder
{
    public function run()
    {
        // Users
        $users = [
            [
                'id' => 1,
                'username' => 'Super Admin',
                'email' => 'superadmin@indradevelopers.com',
                'password' => password_hash('admin123', PASSWORD_DEFAULT),
                'role' => 'Super Admin',
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => 2,
                'username' => 'Admin User',
                'email' => 'admin@indradevelopers.com',
                'password' => password_hash('admin123', PASSWORD_DEFAULT),
                'role' => 'Admin',
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => 3,
                'username' => 'Staff User',
                'email' => 'staff@indradevelopers.com',
                'password' => password_hash('staff123', PASSWORD_DEFAULT),
                'role' => 'Staff',
                'created_at' => date('Y-m-d H:i:s'),
            ]
        ];
        $this->db->table('users')->insertBatch($users);

        // Roles
        $roles = [
            [
                'id' => 1,
                'name' => 'Super Admin',
                'permissions' => json_encode(['all']),
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => 2,
                'name' => 'Admin',
                'permissions' => json_encode(['dashboard', 'seo', 'cms', 'settings', 'projects', 'blog', 'pages', 'leads']),
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => 3,
                'name' => 'Staff',
                'permissions' => json_encode(['dashboard', 'leads', 'blog']),
                'created_at' => date('Y-m-d H:i:s'),
            ]
        ];
        $this->db->table('roles')->insertBatch($roles);

        // Settings
        $settings = [
            [
                'key' => 'settings',
                'value' => json_encode([
                    'website' => [
                        'name' => 'Indra Developers',
                        'slogan' => 'Building Dreams, Creating Homes',
                        'headerLogo' => '',
                        'footerLogo' => ''
                    ],
                    'contact' => [
                        'phone' => '+91 1234567890',
                        'email' => 'info@indradevelopers.com',
                        'address' => '123 Main Street, City, State - 500001'
                    ],
                    'mail' => [
                        'host' => 'smtp.example.com',
                        'port' => '587',
                        'username' => '',
                        'password' => '',
                        'fromEmail' => 'info@indradevelopers.com',
                        'fromName' => 'Indra Developers'
                    ],
                    'security' => [
                        'enableSSL' => true,
                        'enableCaptcha' => false,
                        'sessionTimeout' => 30
                    ],
                    'theme' => [
                        'primaryColor' => '#2563eb',
                        'secondaryColor' => '#1e40af',
                        'accentColor' => '#3b82f6',
                        'textColor' => '#1f2937'
                    ],
                    'footer' => [
                        'text' => 'Indra Developers is a leading real estate company dedicated to building quality homes and creating thriving communities.',
                        'copyright' => '© 2025 Indra Developers. All rights reserved.'
                    ],
                    'social' => [
                        'facebook' => 'https://facebook.com/indradevelopers',
                        'twitter' => 'https://twitter.com/indradevelopers',
                        'instagram' => 'https://instagram.com/indradevelopers',
                        'linkedin' => 'https://linkedin.com/company/indradevelopers'
                    ]
                ]),
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'key' => 'seoSettings',
                'value' => json_encode([
                    'general' => [
                        'siteTitle' => 'Indra Developers - Premium Real Estate',
                        'metaDescription' => 'Leading real estate developer offering premium plots and properties',
                        'keywords' => 'real estate, plots, properties, land, investment',
                        'favicon' => '',
                        'headerLogo' => '',
                        'footerLogo' => ''
                    ],
                    'analytics' => [
                        'googleAnalyticsId' => '',
                        'googleTagManagerId' => '',
                        'facebookPixelId' => '',
                        'hotjarId' => '',
                        'enableTracking' => true
                    ],
                    'webmaster' => [
                        'googleVerification' => '',
                        'bingVerification' => '',
                        'yandexVerification' => ''
                    ],
                    'robots' => [
                        'content' => 'User-agent: *\nAllow: /'
                    ],
                    'sitemap' => [
                        'enabled' => true,
                        'frequency' => 'weekly',
                        'priority' => 0.8
                    ],
                    'socialMeta' => [
                        'ogTitle' => 'Indra Developers',
                        'ogDescription' => 'Premium Real Estate Developer',
                        'ogImage' => '',
                        'twitterCard' => 'summary_large_image',
                        'twitterSite' => '@indradevelopers'
                    ],
                    'schema' => [
                        'organizationName' => 'Indra Developers',
                        'organizationType' => 'RealEstateAgent',
                        'logoUrl' => '',
                        'contactPhone' => '+91 1234567890',
                        'contactEmail' => 'info@indradevelopers.com',
                        'address' => '',
                        'priceRange' => '₹₹₹',
                        'areaServed' => 'India'
                    ],
                    'indexing' => [
                        'allowIndexing' => true,
                        'noFollow' => false,
                        'noArchive' => false,
                        'noSnippet' => false,
                        'noImageIndex' => false,
                        'maxSnippet' => 160,
                        'maxImagePreview' => 'large',
                        'maxVideoPreview' => -1
                    ]
                ]),
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'key' => 'cmsPages',
                'value' => json_encode([
                    'home' => [
                        'bannerType' => 'slider',
                        'bannerImages' => [
                            'https://images.unsplash.com/photo-1762765752145-caf01e3d389b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZWFsJTIwZXN0YXRlJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzYyOTA4NjQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
                            'https://images.unsplash.com/photo-1757952854354-0b5495662b9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjByZXNpZGVudGlhbCUyMGNvbXBsZXh8ZW58MXx8fHwxNzYyODk1MjMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
                            'https://images.unsplash.com/photo-1599412965471-e5f860059f07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBleHRlcmlvcnxlbnwxfHx8fDE3NjI4MzE3NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
                            'https://images.unsplash.com/photo-1627141234469-24711efb373c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NjI5MDE2ODl8MA&ixlib=rb-4.1.0&q=80&w=1080'
                        ],
                        'singleBannerImage' => '',
                        'title' => 'Building Dreams, Creating Landmarks',
                        'subtitle' => 'Premium Real Estate Development with Unmatched Quality',
                        'description' => '<p>Indra Developers is a leading real estate company committed to delivering exceptional properties and creating dream homes. With years of experience in the industry, we have established ourselves as a trusted name in real estate development.</p><p>Our mission is to provide quality plots and properties that meet the aspirations of our clients while maintaining the highest standards of excellence.</p>',
                        'features' => [
                            ['title' => 'Prime Locations', 'description' => 'Strategically located properties in developing areas with excellent connectivity and infrastructure'],
                            ['title' => 'Trusted Developer', 'description' => '15+ years of excellence in real estate with 500+ happy families and successful projects'],
                            ['title' => 'Affordable Pricing', 'description' => 'Transparent pricing with flexible payment options to suit every budget and requirement']
                        ]
                    ],
                    'about' => [
                        'title' => 'About Indra Developers',
                        'content' => '<p>Indra Developers is a leading real estate company committed to delivering exceptional properties and creating dream homes. With years of experience in the industry, we have established ourselves as a trusted name in real estate development.</p><p>Our mission is to provide quality plots and properties that meet the aspirations of our clients while maintaining the highest standards of excellence.</p>',
                        'image' => '',
                        'vision' => 'To be the most trusted and preferred real estate developer',
                        'mission' => 'To create sustainable communities and deliver value to our customers'
                    ],
                    'contact' => [
                        'title' => 'Contact Us',
                        'address' => '123 Main Street, City, State - 500001',
                        'phone' => '+91 1234567890',
                        'email' => 'info@indradevelopers.com',
                        'mapEmbedUrl' => '',
                        'workingHours' => 'Mon - Sat: 9:00 AM - 6:00 PM'
                    ],
                    'gallery' => [
                        'images' => []
                    ]
                ]),
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'key' => 'menus',
                'value' => json_encode([
                    'header' => [
                        ['id' => '1', 'label' => 'Home', 'url' => '/', 'order' => 1],
                        ['id' => '2', 'label' => 'Projects', 'url' => '/projects', 'order' => 2],
                        ['id' => '3', 'label' => 'About', 'url' => '/about', 'order' => 3],
                        ['id' => '4', 'label' => 'Gallery', 'url' => '/gallery', 'order' => 4],
                        ['id' => '5', 'label' => 'Blog', 'url' => '/blog', 'order' => 5],
                        ['id' => '6', 'label' => 'Contact', 'url' => '/contact', 'order' => 6]
                    ],
                    'footer' => [
                        ['id' => '7', 'label' => 'Privacy Policy', 'url' => '/privacy', 'order' => 1],
                        ['id' => '8', 'label' => 'Terms & Conditions', 'url' => '/terms', 'order' => 2],
                        ['id' => '9', 'label' => 'Sitemap', 'url' => '/sitemap', 'order' => 3]
                    ]
                ]),
                'created_at' => date('Y-m-d H:i:s'),
            ]
        ];
        $this->db->table('settings')->insertBatch($settings);

        // Project Categories
        $projectCategories = [
            ['id' => 1, 'name' => 'Residential Plots', 'slug' => 'residential-plots', 'created_at' => date('Y-m-d H:i:s')],
            ['id' => 2, 'name' => 'Commercial Plots', 'slug' => 'commercial-plots', 'created_at' => date('Y-m-d H:i:s')],
            ['id' => 3, 'name' => 'Agricultural Land', 'slug' => 'agricultural-land', 'created_at' => date('Y-m-d H:i:s')],
            ['id' => 4, 'name' => 'Luxury Villas', 'slug' => 'luxury-villas', 'created_at' => date('Y-m-d H:i:s')]
        ];
        $this->db->table('project_categories')->insertBatch($projectCategories);

        // Locations
        $locations = [
            ['id' => 1, 'name' => 'Hyderabad', 'slug' => 'hyderabad', 'created_at' => date('Y-m-d H:i:s')],
            ['id' => 2, 'name' => 'Bangalore', 'slug' => 'bangalore', 'created_at' => date('Y-m-d H:i:s')],
            ['id' => 3, 'name' => 'Chennai', 'slug' => 'chennai', 'created_at' => date('Y-m-d H:i:s')],
            ['id' => 4, 'name' => 'Mumbai', 'slug' => 'mumbai', 'created_at' => date('Y-m-d H:i:s')]
        ];
        $this->db->table('locations')->insertBatch($locations);

        // Projects (Simplified insertion)
        $projects = [
            [
                'id' => 1,
                'name' => 'Green Valley Estates',
                'category_id' => 1,
                'location_id' => 1,
                'description' => '<p>Premium residential plots in the heart of Hyderabad...</p>',
                'total_plots' => 150,
                'plots_data' => json_encode([
                    ['plotNumber' => '101', 'dimensions' => '30x40', 'facing' => 'East', 'status' => 'Available'],
                    // ... abbreviated for brevity, but real data would go here
                ]),
                'images' => json_encode([
                    'https://images.unsplash.com/photo-1689574666545-3f2f9afdf632?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
                ]),
                'featured_image' => 'https://images.unsplash.com/photo-1689574666545-3f2f9afdf632?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
                'status' => 'Active',
                'created_at' => date('Y-m-d H:i:s')
            ],
            [
                'id' => 2,
                'name' => 'Sunrise Heights',
                'category_id' => 1,
                'location_id' => 2,
                'description' => '<p>Luxurious residential plots in Bangalore...</p>',
                'total_plots' => 200,
                'plots_data' => json_encode([]),
                'images' => json_encode([]),
                'featured_image' => 'https://images.unsplash.com/photo-1747187967039-bced171aa247?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
                'status' => 'Active',
                'created_at' => date('Y-m-d H:i:s')
            ],
            [
                'id' => 3,
                'name' => 'Metro Commercial Hub',
                'category_id' => 2,
                'location_id' => 1,
                'description' => '<p>Strategic commercial plots near metro station...</p>',
                'total_plots' => 50,
                'plots_data' => json_encode([]),
                'images' => json_encode([]),
                'featured_image' => 'https://images.unsplash.com/photo-1632398793634-e3cd63fc9e84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
                'status' => 'Active',
                'created_at' => date('Y-m-d H:i:s')
            ]
        ];
        $this->db->table('projects')->insertBatch($projects);

        // Blog Categories
        $blogCategories = [
            ['id' => 1, 'name' => 'Real Estate News', 'slug' => 'real-estate-news', 'created_at' => date('Y-m-d H:i:s')],
            ['id' => 2, 'name' => 'Investment Tips', 'slug' => 'investment-tips', 'created_at' => date('Y-m-d H:i:s')],
            ['id' => 3, 'name' => 'Property Guide', 'slug' => 'property-guide', 'created_at' => date('Y-m-d H:i:s')],
            ['id' => 4, 'name' => 'Company Updates', 'slug' => 'company-updates', 'created_at' => date('Y-m-d H:i:s')]
        ];
        $this->db->table('blog_categories')->insertBatch($blogCategories);

        // Blog Posts
        $blogPosts = [
            [
                'id' => 1,
                'title' => 'Top 10 Tips for Buying Your First Plot',
                'category_id' => 3,
                'content' => '<p>Buying your first plot is an exciting milestone...</p>',
                'slug' => 'top-10-tips-buying-first-plot',
                'status' => 'Published',
                'author' => 'Indra Developers Team',
                'publish_date' => date('Y-m-d H:i:s'),
                'created_at' => date('Y-m-d H:i:s')
            ],
            [
                'id' => 2,
                'title' => 'Real Estate Investment: Why Plots are a Smart Choice',
                'category_id' => 2,
                'content' => '<p>Investing in plots has always been considered a wise financial decision...</p>',
                'slug' => 'real-estate-investment-plots-smart-choice',
                'status' => 'Published',
                'author' => 'Indra Developers Team',
                'publish_date' => date('Y-m-d H:i:s'),
                'created_at' => date('Y-m-d H:i:s')
            ],
            [
                'id' => 3,
                'title' => 'Indra Developers Launches New Project in Bangalore',
                'category_id' => 4,
                'content' => '<p>We are thrilled to announce the launch of our latest project...</p>',
                'slug' => 'indra-developers-new-project-bangalore',
                'status' => 'Published',
                'author' => 'Indra Developers Team',
                'publish_date' => date('Y-m-d H:i:s'),
                'created_at' => date('Y-m-d H:i:s')
            ]
        ];
        $this->db->table('blog_posts')->insertBatch($blogPosts);

        // Leads
        $leads = [
            [
                'id' => 1,
                'name' => 'Rajesh Kumar',
                'email' => 'rajesh.kumar@example.com',
                'phone' => '+91 9876543210',
                'project_interest' => 'Green Valley Estates',
                'message' => 'I am interested in knowing more...',
                'status' => 'New',
                'source' => 'Website',
                'created_at' => date('Y-m-d H:i:s', strtotime('-2 days'))
            ],
            [
                'id' => 2,
                'name' => 'Priya Sharma',
                'email' => 'priya.sharma@example.com',
                'phone' => '+91 9876543211',
                'project_interest' => 'Sunrise Heights',
                'message' => 'Looking for a 40x60 plot...',
                'status' => 'Contacted',
                'source' => 'Website',
                'created_at' => date('Y-m-d H:i:s', strtotime('-1 day'))
            ]
        ];
        $this->db->table('leads')->insertBatch($leads);
    }
}
