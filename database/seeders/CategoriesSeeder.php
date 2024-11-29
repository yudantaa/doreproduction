<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('categories')->insert([
            ['nama_kategori' => 'Sound System', 'created_at' => now(), 'updated_at' => now()],
            ['nama_kategori' => 'Lighting', 'created_at' => now(), 'updated_at' => now()],
            ['nama_kategori' => 'Generator', 'created_at' => now(), 'updated_at' => now()],
            ['nama_kategori' => 'Additional Items', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
