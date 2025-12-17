<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;

class Auth extends ResourceController
{
    protected $format = 'json';

    public function login()
    {
        $data = $this->request->getJSON(true);
        if (empty($data)) {
            $data = $this->request->getPost();
        }

        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$email || !$password) {
            return $this->failValidationError('Email and password are required');
        }

        $db = \Config\Database::connect();
        $user = $db->table('users')
            ->where('email', $email)
            ->get()
            ->getRowArray();

        if ($user && $user['password'] === $password) { // In a real app, use password_verify
            // Remove password from response
            unset($user['password']);

            return $this->respond([
                'status' => 'success',
                'message' => 'Login successful',
                'user' => $user
            ]);
        }

        return $this->failUnauthorized('Invalid email or password');
    }
}
