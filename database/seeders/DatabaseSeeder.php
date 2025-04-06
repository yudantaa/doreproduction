<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'SUPER ADMIN',
            'email' => 'super@mail.com',
            'password' => Hash::make('asdasd123'),
            'role' => 'SUPER ADMIN'
        ]);

        User::factory()->create([
            'name' => 'ADMIN',
            'email' => 'admin@mail.com',
            'password' => Hash::make('asdasd123'),
            'role' => 'ADMIN'
        ]);

        $this->call([
            CategoriesSeeder::class,
            ItemsSeeder::class,
            LoansSeeder::class,
        ]);

    }
}