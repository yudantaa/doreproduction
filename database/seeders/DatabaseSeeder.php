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

        User::create([
            'name' => 'SUPER ADMIN A',
            'email' => 'super@mail.com',
            'password' => Hash::make('asdasd123'),
            'role' => 'SUPER ADMIN'
        ]);

        User::create([
            'name' => 'ADMIN A',
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