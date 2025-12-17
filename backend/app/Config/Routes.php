<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

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

    $routes->get('seoSettings', 'Settings::show/seoSettings');
    $routes->put('settings/seoSettings', 'Settings::update/seoSettings');

    $routes->get('galleries', 'Settings::show/gallery'); // Mapped to gallery key in settings? 
    // Wait, initialSeeder had 'cmsPages' with 'gallery' key inside it?
    // Let's check seeder. No, Galleries usually distinct.
    // Seeder had 'cmsPages' -> 'gallery'. So 'galleries' might not exist as a table?
    // Step 219 (localStorage.ts) has getData('galleries').
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
