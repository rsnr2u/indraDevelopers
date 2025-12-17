<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateSiteVisitsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'lead_id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'null' => true,
            ],
            'customer_name' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
            ],
            'customer_phone' => [
                'type' => 'VARCHAR',
                'constraint' => '50',
            ],
            'customer_email' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true,
            ],
            'project_id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
            ],
            'visit_date' => [
                'type' => 'DATE',
            ],
            'visit_time' => [
                'type' => 'TIME',
                'null' => true,
            ],
            'status' => [
                'type' => 'ENUM',
                'constraint' => ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No Show'],
                'default' => 'Scheduled',
            ],
            'notes' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'assigned_to' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('site_visits');
    }

    public function down()
    {
        $this->forge->dropTable('site_visits');
    }
}
