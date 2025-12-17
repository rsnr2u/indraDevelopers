<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;

class Settings extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $db = \Config\Database::connect();
        $settings = $db->table('settings')->get()->getResultArray();

        $formatted = [];
        foreach ($settings as $setting) {
            $formatted[$setting['key']] = json_decode($setting['value'], true);
        }

        return $this->respond($formatted);
    }

    public function show($key = null)
    {
        $db = \Config\Database::connect();
        $setting = $db->table('settings')->where('key', $key)->get()->getRowArray();

        if (!$setting) {
            // Return empty object for virtual settings to allow frontend to initialize
            return $this->respond([]);
        }

        return $this->respond(json_decode($setting['value'], true));
    }

    public function update($key = null)
    {
        $data = $this->request->getJSON(true);
        $db = \Config\Database::connect();

        // Check if key exists
        $exists = $db->table('settings')->where('key', $key)->countAllResults();

        if ($exists) {
            $db->table('settings')->where('key', $key)->update([
                'value' => json_encode($data),
                'updated_at' => date('Y-m-d H:i:s')
            ]);
            return $this->respond(['message' => 'Settings updated', 'key' => $key]);
        } else {
            // Create new setting
            $db->table('settings')->insert([
                'key' => $key,
                'value' => json_encode($data),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]);
            return $this->respondCreated(['message' => 'Settings created', 'key' => $key]);
        }
    }
}
