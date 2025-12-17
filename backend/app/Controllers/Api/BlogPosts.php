<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;

class BlogPosts extends ResourceController
{
    public function index()
    {
        $db = \Config\Database::connect();
        $data = $db->table('blog_posts')
            ->select('blog_posts.*, blog_categories.name as category_name')
            ->join('blog_categories', 'blog_categories.id = blog_posts.category_id')
            ->orderBy('created_at', 'DESC')
            ->get()
            ->getResultArray();
        return $this->respond($data);
    }

    public function show($id = null)
    {
        $db = \Config\Database::connect();
        $data = $db->table('blog_posts')
            ->select('blog_posts.*, blog_categories.name as category_name')
            ->join('blog_categories', 'blog_categories.id = blog_posts.category_id')
            ->where('blog_posts.id', $id)
            ->get()
            ->getRowArray();
        if ($data) {
            return $this->respond($data);
        }
        return $this->failNotFound();
    }

    public function create()
    {
        $data = $this->request->getJSON(true);
        $db = \Config\Database::connect();

        $insertData = [
            'title' => $data['title'],
            'category_id' => $data['categoryId'] ?? $data['category_id'],
            'content' => $data['content'],
            'slug' => $data['slug'],
            'status' => $data['status'] ?? 'Draft',
            'author' => $data['author'] ?? 'Admin',
            'publish_date' => $data['publishDate'] ?? date('Y-m-d H:i:s'),
            'created_at' => date('Y-m-d H:i:s')
        ];

        $db->table('blog_posts')->insert($insertData);
        $insertData['id'] = $db->insertID();
        return $this->respondCreated($insertData);
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        $db = \Config\Database::connect();

        // Handle field mapping if necessary (frontend might send camelCase)
        $updateData = [];
        if (isset($data['title']))
            $updateData['title'] = $data['title'];
        if (isset($data['categoryId']))
            $updateData['category_id'] = $data['categoryId'];
        if (isset($data['content']))
            $updateData['content'] = $data['content'];
        if (isset($data['slug']))
            $updateData['slug'] = $data['slug'];
        if (isset($data['status']))
            $updateData['status'] = $data['status'];
        if (isset($data['publishDate']))
            $updateData['publish_date'] = $data['publishDate'];
        $updateData['updated_at'] = date('Y-m-d H:i:s');

        $db->table('blog_posts')->where('id', $id)->update($updateData);
        return $this->respond($updateData);
    }

    public function delete($id = null)
    {
        $db = \Config\Database::connect();
        $db->table('blog_posts')->where('id', $id)->delete();
        return $this->respondDeleted(['id' => $id]);
    }
}
