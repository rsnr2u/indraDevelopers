<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;

class BlogCategories extends ResourceController
{
    public function index()
    {
        $db = \Config\Database::connect();
        $data = $db->table('blog_categories')->get()->getResultArray();
        return $this->respond($data);
    }

    public function show($id = null)
    {
        $db = \Config\Database::connect();
        $data = $db->table('blog_categories')->where('id', $id)->get()->getRowArray();
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
            'name' => $data['name'],
            'slug' => $data['slug'],
            'created_at' => date('Y-m-d H:i:s')
        ];

        $db->table('blog_categories')->insert($insertData);
        $insertData['id'] = $db->insertID();
        return $this->respondCreated($insertData);
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        $db = \Config\Database::connect();
        $db->table('blog_categories')->where('id', $id)->update($data);
        return $this->respond($data);
    }

    public function delete($id = null)
    {
        $db = \Config\Database::connect();
        $db->table('blog_categories')->where('id', $id)->delete();
        return $this->respondDeleted(['id' => $id]);
    }
}
