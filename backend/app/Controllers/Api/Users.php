<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;

class Users extends ResourceController
{
    public function index()
    {
        $db = \Config\Database::connect();
        $data = $db->table('users')->select('id, username, email, role, created_at')->get()->getResultArray();
        return $this->respond($data);
    }

    // Minimal implementation for Dashboard stats
}
