<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;

class SiteVisits extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $db = \Config\Database::connect();
        $visits = $db->table('site_visits')
            ->orderBy('visit_date', 'ASC')
            ->get()
            ->getResultArray();

        return $this->respond($visits);
    }

    public function show($id = null)
    {
        $db = \Config\Database::connect();
        $visit = $db->table('site_visits')->where('id', $id)->get()->getRowArray();

        if (!$visit) {
            return $this->failNotFound('Site visit not found');
        }

        return $this->respond($visit);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);

        $insertData = [
            'lead_id' => $data['leadId'] ?? ($data['lead_id'] ?? null),
            'customer_name' => $data['customerName'] ?? ($data['customer_name'] ?? ''),
            'customer_phone' => $data['customerPhone'] ?? ($data['customer_phone'] ?? ''),
            'customer_email' => $data['customerEmail'] ?? ($data['customer_email'] ?? ''),
            'project_id' => $data['projectId'] ?? ($data['project_id'] ?? null),
            'visit_date' => $data['visitDate'] ?? ($data['visit_date'] ?? date('Y-m-d')),
            'visit_time' => $data['visitTime'] ?? ($data['visit_time'] ?? null),
            'status' => $data['status'] ?? 'Scheduled',
            'notes' => $data['notes'] ?? '',
            'assigned_to' => $data['assignedTo'] ?? ($data['assigned_to'] ?? ''),
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ];

        $db = \Config\Database::connect();
        try {
            $db->table('site_visits')->insert($insertData);
            $insertId = $db->insertID();
            return $this->respondCreated(['id' => $insertId, 'message' => 'Site visit scheduled successfully']);
        } catch (\Exception $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        $db = \Config\Database::connect();

        $updateData = [];
        $fields = ['customerName', 'customerPhone', 'customerEmail', 'status', 'notes', 'assignedTo', 'visitDate', 'visitTime'];

        foreach ($fields as $field) {
            $dbField = strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $field));
            if (isset($data[$field]))
                $updateData[$dbField] = $data[$field];
            if (isset($data[$dbField]))
                $updateData[$dbField] = $data[$dbField];
        }

        if (isset($data['projectId']) || isset($data['project_id']))
            $updateData['project_id'] = $data['projectId'] ?? $data['project_id'];

        if (isset($data['leadId']) || isset($data['lead_id']))
            $updateData['lead_id'] = $data['leadId'] ?? $data['lead_id'];

        if (!empty($updateData)) {
            $updateData['updated_at'] = date('Y-m-d H:i:s');
            $db->table('site_visits')->where('id', $id)->update($updateData);
        }

        return $this->respond(['message' => 'Site visit updated successfully']);
    }

    public function delete($id = null)
    {
        $db = \Config\Database::connect();
        $db->table('site_visits')->where('id', $id)->delete();

        return $this->respondDeleted(['message' => 'Site visit deleted successfully']);
    }
}
