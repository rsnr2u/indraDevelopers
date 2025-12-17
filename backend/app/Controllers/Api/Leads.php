<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;

class Leads extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $db = \Config\Database::connect();
        $leads = $db->table('leads')->orderBy('created_at', 'DESC')->get()->getResultArray();
        return $this->respond($leads);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);
        if (empty($data)) {
            $data = $this->request->getPost();
        }

        $db = \Config\Database::connect();

        $insertData = [
            'name' => $data['name'] ?? '',
            'email' => $data['email'] ?? '',
            'phone' => $data['phone'] ?? '',
            'project_interest' => $data['projectInterest'] ?? '',
            'message' => $data['message'] ?? '',
            'status' => 'New',
            'source' => 'Website',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ];

        $db->table('leads')->insert($insertData);
        $id = $db->insertID();

        $insertData['id'] = $id;

        return $this->respondCreated($insertData);
    }

    public function show($id = null)
    {
        $db = \Config\Database::connect();
        $lead = $db->table('leads')->where('id', $id)->get()->getRowArray();

        if ($lead) {
            // Decode notes if present
            if (isset($lead['notes'])) {
                $lead['notes'] = json_decode($lead['notes']);
            }
            return $this->respond($lead);
        }
        return $this->failNotFound();
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        $db = \Config\Database::connect();

        $updateData = [];
        if (isset($data['status']))
            $updateData['status'] = $data['status'];
        if (isset($data['notes']))
            $updateData['notes'] = json_encode($data['notes']);
        // Add other fields if editable

        if (!empty($updateData)) {
            $updateData['updated_at'] = date('Y-m-d H:i:s');
            $db->table('leads')->where('id', $id)->update($updateData);
        }

        return $this->respond($updateData);
    }
    public function delete($id = null)
    {
        $db = \Config\Database::connect();
        $db->table('leads')->where('id', $id)->delete();
        return $this->respondDeleted(['message' => 'Lead deleted successfully']);
    }
}
