<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;

class Testimonials extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $db = \Config\Database::connect();
        $testimonials = $db->table('testimonials')
            ->orderBy('created_at', 'DESC')
            ->get()
            ->getResultArray();

        return $this->respond($testimonials);
    }

    public function show($id = null)
    {
        $db = \Config\Database::connect();
        $testimonial = $db->table('testimonials')->where('id', $id)->get()->getRowArray();

        if (!$testimonial) {
            return $this->failNotFound('Testimonial not found');
        }

        return $this->respond($testimonial);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);

        $insertData = [
            'name' => $data['name'] ?? '',
            'designation' => $data['designation'] ?? '',
            'company' => $data['company'] ?? '',
            'image' => $data['image'] ?? '',
            'rating' => $data['rating'] ?? 5,
            'testimonial' => $data['testimonial'] ?? '',
            'project_id' => $data['projectId'] ?? ($data['project_id'] ?? null),
            'type' => $data['type'] ?? 'text',
            'video_url' => $data['videoUrl'] ?? ($data['video_url'] ?? ''),
            'featured' => $data['featured'] ?? false,
            'status' => $data['status'] ?? 'Active',
            'created_at' => date('Y-m-d H:i:s')
        ];

        $db = \Config\Database::connect();
        $db->table('testimonials')->insert($insertData);
        $insertId = $db->insertID();

        return $this->respondCreated(['id' => $insertId, 'message' => 'Testimonial created successfully']);
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        $db = \Config\Database::connect();

        $updateData = [];
        if (isset($data['name']))
            $updateData['name'] = $data['name'];
        if (isset($data['designation']))
            $updateData['designation'] = $data['designation'];
        if (isset($data['company']))
            $updateData['company'] = $data['company'];
        if (isset($data['image']))
            $updateData['image'] = $data['image'];
        if (isset($data['rating']))
            $updateData['rating'] = $data['rating'];
        if (isset($data['testimonial']))
            $updateData['testimonial'] = $data['testimonial'];
        if (isset($data['projectId']) || isset($data['project_id']))
            $updateData['project_id'] = $data['projectId'] ?? $data['project_id'];
        if (isset($data['type']))
            $updateData['type'] = $data['type'];
        if (isset($data['videoUrl']) || isset($data['video_url']))
            $updateData['video_url'] = $data['videoUrl'] ?? $data['video_url'];
        if (isset($data['featured']))
            $updateData['featured'] = $data['featured'];
        if (isset($data['status']))
            $updateData['status'] = $data['status'];
        $updateData['updated_at'] = date('Y-m-d H:i:s');

        $db->table('testimonials')->where('id', $id)->update($updateData);

        return $this->respond(['message' => 'Testimonial updated successfully']);
    }

    public function delete($id = null)
    {
        $db = \Config\Database::connect();
        $db->table('testimonials')->where('id', $id)->delete();

        return $this->respondDeleted(['message' => 'Testimonial deleted successfully']);
    }
}
