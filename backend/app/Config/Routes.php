<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

$routes->options('(:any)', static function () {
    $response = service('response');
    $response->setStatusCode(200);
    return $response;
});

$routes->group('api', ['namespace' => 'App\\Controllers\\Api'], function ($routes) {
    $routes->resource('projects');
    $routes->resource('leads');
    $routes->resource('settings'); // Generic settings access

    // Specialized Resources
    $routes->resource('locations');
    $routes->resource('projectCategories'); // CamelCase to match frontend expected?
    // CodeIgniter resource routes usually handle 'projectCategories' -> ProjectCategories controller
    // But standard is 'project-categories' -> ProjectCategories.
    // Frontend calls `getData('projectCategories')` -> GET /projectCategories
    // So resource name must be 'projectCategories' to match URL.

    $routes->resource('blogPosts');
    $routes->resource('blogCategories');
    $routes->resource('users');
    $routes->resource('testimonials');
    $routes->resource('pages');

    // Mapped Settings Routes (Virtual Resources)
    // These map specific GET requests to Settings::show/$key
    // And PUT requests to Settings::update/$key
    $routes->get('menus', 'Settings::show/menus');
    $routes->put('settings/menus', 'Settings::update/menus');

    $routes->get('cmsPages', 'Settings::show/cmsPages');
    $routes->put('settings/cmsPages', 'Settings::update/cmsPages');

    // General Settings
    $routes->get('settings', 'Settings::show/settings');
    $routes->put('settings/settings', 'Settings::update/settings');

    $routes->get('seoSettings', 'Settings::show/seoSettings');
    $routes->put('settings/seoSettings', 'Settings::update/seoSettings');

    $routes->get('exitIntentSettings', 'Settings::show/exitIntentSettings');
    $routes->put('settings/exitIntentSettings', 'Settings::update/exitIntentSettings');

    $routes->get('cmsPages', 'Settings::show/cmsPages');
    $routes->put('settings/cmsPages', 'Settings::update/cmsPages');

    $routes->get('menus', 'Settings::show/menus');
    $routes->put('settings/menus', 'Settings::update/menus');

    $routes->get('whatsappWidgetSettings', 'Settings::show/whatsappWidgetSettings');
    $routes->put('settings/whatsappWidgetSettings', 'Settings::update/whatsappWidgetSettings');

    $routes->get('galleries', 'Settings::show/galleries'); // Updated mapping
    $routes->put('settings/galleries', 'Settings::update/galleries');

    $routes->get('emailTemplates', 'Settings::show/emailTemplates');
    $routes->put('settings/emailTemplates', 'Settings::update/emailTemplates');

    $routes->get('analytics', 'Settings::show/analytics');
    // Analytics might be read-only or updated via background processes, but allowing update for now if it stores cached data
    $routes->put('settings/analytics', 'Settings::update/analytics');

    $routes->get('customPages', 'Settings::show/customPages');
    $routes->put('settings/customPages', 'Settings::update/customPages');

    // Site Visits - Needs a Controller, but can be a setting for now if simple, 
    // BUT SiteVisits.tsx uses structured data (CRUD). 
    // It calls `getData('siteVisits')` -> GET api/siteVisits
    // It calls `addItem('siteVisits', ...)` -> POST api/siteVisits
    // It calls `updateItem('siteVisits', ...)` -> PUT api/siteVisits/id
    // So it MUST be a Resource Controller, not a Setting.
    $routes->resource('siteVisits');
    // In Gallery.tsx: getData('galleries').
    // I need to see if 'galleries' is a table or a setting.
    // In InitialSeeder: NO 'galleries' table seeded.
    // But 'cmsPages' had 'gallery' key.
    // So getData('galleries') probably returns undefined right now if seeded data is truth.
    // I should serve empty list or implement galleries table if needed.
    // For now, let's assume it's missing or I should create it.
    // Implementation: serve empty list or 404. Let's redirect to settings? No.
    // I'll create a simple Galleries controller later if needed.

    $routes->post('auth/login', 'Auth::login');
});
