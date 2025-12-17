<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;

class Projects extends ResourceController
{
    protected $modelName = 'App\Models\ProjectModel';
    protected $format = 'json';

    public function index()
    {
        // For now, raw DB query or creating a model.
        // Let's create a model first or just use query builder here for speed, 
        // but creating a model is better practice.
        // I'll assume we'll create App\Models\ProjectModel momentarily.
        // Or I can just use the DB class directly here if Model doesn't exist yet.

        $db = \Config\Database::connect();
        $query = $db->table('projects')
            ->select('projects.*, locations.name as location_name, project_categories.name as category_name')
            ->join('locations', 'locations.id = projects.location_id')
            ->join('project_categories', 'project_categories.id = projects.category_id')
            ->get();

        $projects = $query->getResultArray();

        // Process JSON fields
        foreach ($projects as &$project) {
            $project['plots'] = json_decode($project['plots_data'] ?? '[]');
            $project['images'] = json_decode($project['images'] ?? '[]');
            $project['schema'] = json_decode($project['schema_data'] ?? '{}');
            $project['seo'] = json_decode($project['seo_data'] ?? '{}');
            unset($project['plots_data'], $project['schema_data'], $project['seo_data']);
        }

        return $this->respond($projects);
    }

    public function show($id = null)
    {
        $db = \Config\Database::connect();
        $project = $db->table('projects')
            ->select('projects.*, locations.name as location_name, project_categories.name as category_name')
            ->join('locations', 'locations.id = projects.location_id')
            ->join('project_categories', 'project_categories.id = projects.category_id')
            ->where('projects.id', $id)
            ->get()
            ->getRowArray();

        if (!$project) {
            return $this->failNotFound('Project not found');
        }

        $project['plots'] = json_decode($project['plots_data'] ?? '[]');
        $project['images'] = json_decode($project['images'] ?? '[]');
        $project['schema'] = json_decode($project['schema_data'] ?? '{}');
        $project['seo'] = json_decode($project['seo_data'] ?? '{}');
        unset($project['plots_data'], $project['schema_data'], $project['seo_data']);

        return $this->respond($project);
    }
    public function create()
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();

        $db = \Config\Database::connect();

        $insertData = [
            'name' => $data['name'] ?? '',
            'category_id' => $data['categoryId'] ?? ($data['category_id'] ?? null),
            'location_id' => $data['locationId'] ?? ($data['location_id'] ?? null),
            'description' => $data['description'] ?? '',
            'total_plots' => $data['totalPlots'] ?? ($data['total_plots'] ?? 0),
            'plots_data' => json_encode($data['plots'] ?? []),
            'images' => json_encode($data['images'] ?? []),
            'featured_image' => $data['featuredImage'] ?? ($data['featured_image'] ?? ''),
            'status' => $data['status'] ?? 'Active',
            'video_url' => $data['videoUrl'] ?? ($data['video_url'] ?? ''),
            'brochure_pdf' => $data['brochurePdf'] ?? ($data['brochure_pdf'] ?? ''),
            'map_embed_url' => $data['mapEmbedUrl'] ?? ($data['map_embed_url'] ?? ''),
            'rera_number' => $data['reraNumber'] ?? ($data['rera_number'] ?? ''),
            'amenities' => json_encode($data['amenities'] ?? []),
            'location_advantages' => json_encode($data['locationAdvantages'] ?? []),
            'why_invest' => json_encode($data['whyInvest'] ?? []),
            'schema_data' => json_encode($data['schema'] ?? []),
            'seo_data' => json_encode($data['seo'] ?? []),
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ];

        try {
            $db->table('projects')->insert($insertData);
            $insertId = $db->insertID();
            return $this->respondCreated(['id' => $insertId, 'message' => 'Project created successfully']);
        } catch (\Exception $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        $db = \Config\Database::connect();

        $updateData = [];
        $fields = [
            'name',
            'description',
            'status',
            'video_url',
            'brochure_pdf',
            'map_embed_url',
            'rera_number',
            'featured_image'
        ];

        foreach ($fields as $field) {
            $camelCase = lcfirst(str_replace(' ', '', ucwords(str_replace('_', ' ', $field))));
            if (isset($data[$camelCase]))
                $updateData[$field] = $data[$camelCase];
            if (isset($data[$field]))
                $updateData[$field] = $data[$field];
        }

        // Handle specific fields mapping
        if (isset($data['categoryId']) || isset($data['category_id']))
            $updateData['category_id'] = $data['categoryId'] ?? $data['category_id'];

        if (isset($data['locationId']) || isset($data['location_id']))
            $updateData['location_id'] = $data['locationId'] ?? $data['location_id'];

        if (isset($data['totalPlots']) || isset($data['total_plots']))
            $updateData['total_plots'] = $data['totalPlots'] ?? $data['total_plots'];

        // JSON Fields
        $jsonFields = ['plots' => 'plots_data', 'amenities' => 'amenities', 'locationAdvantages' => 'location_advantages', 'whyInvest' => 'why_invest', 'schema' => 'schema_data', 'seo' => 'seo_data', 'images' => 'images'];

        foreach ($jsonFields as $inputKey => $dbKey) {
            if (isset($data[$inputKey])) {
                $updateData[$dbKey] = json_encode($data[$inputKey]);
            }
        }

        if (!empty($updateData)) {
            $updateData['updated_at'] = date('Y-m-d H:i:s');
            $db->table('projects')->where('id', $id)->update($updateData);
        }

        return $this->respond(['message' => 'Project updated successfully']);
    }

    public function delete($id = null)
    {
        $db = \Config\Database::connect();
        $db->table('projects')->where('id', $id)->delete();
        return $this->respondDeleted(['message' => 'Project deleted successfully']);
    }
}
