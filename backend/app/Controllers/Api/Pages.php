<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;

class Pages extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $db = \Config\Database::connect();
        $pages = $db->table('pages')
            ->orderBy('title', 'ASC')
            ->get()
            ->getResultArray();

        return $this->respond($pages);
    }

    public function show($id = null)
    {
        $db = \Config\Database::connect();
        // Allow fetch by ID or Slug
        if (is_numeric($id)) {
            $page = $db->table('pages')->where('id', $id)->get()->getRowArray();
        } else {
            $page = $db->table('pages')->where('slug', $id)->get()->getRowArray();
        }

        if (!$page) {
            return $this->failNotFound('Page not found');
        }

        return $this->respond($page);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);

        $insertData = [
            'title' => $data['title'] ?? '',
            'slug' => $data['slug'] ?? url_title($data['title'] ?? '', '-', true),
            'content' => $data['content'] ?? '',
            'status' => $data['status'] ?? 'Published',
            'meta_title' => $data['metaTitle'] ?? ($data['meta_title'] ?? ''),
            'meta_description' => $data['metaDescription'] ?? ($data['meta_description'] ?? ''),
            'published_at' => $data['publishedAt'] ?? ($data['published_at'] ?? date('Y-m-d H:i:s')),
            'created_at' => date('Y-m-d H:i:s')
        ];

        $db = \Config\Database::connect();
        try {
            $db->table('pages')->insert($insertData);
            $insertId = $db->insertID();
            return $this->respondCreated(['id' => $insertId, 'message' => 'Page created successfully']);
        } catch (\Exception $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        $db = \Config\Database::connect();

        $updateData = [];
        if (isset($data['title']))
            $updateData['title'] = $data['title'];
        if (isset($data['slug']))
            $updateData['slug'] = $data['slug'];
        if (isset($data['content']))
            $updateData['content'] = $data['content'];
        if (isset($data['status']))
            $updateData['status'] = $data['status'];
        if (isset($data['metaTitle']) || isset($data['meta_title']))
            $updateData['meta_title'] = $data['metaTitle'] ?? $data['meta_title'];
        if (isset($data['metaDescription']) || isset($data['meta_description']))
            $updateData['meta_description'] = $data['metaDescription'] ?? $data['meta_description'];
        $updateData['updated_at'] = date('Y-m-d H:i:s');

        $db->table('pages')->where('id', $id)->update($updateData);

        return $this->respond(['message' => 'Page updated successfully']);
    }

    public function delete($id = null)
    {
        $db = \Config\Database::connect();
        $db->table('pages')->where('id', $id)->delete();

        return $this->respondDeleted(['message' => 'Page deleted successfully']);
    }
}
