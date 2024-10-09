<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Create an Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password123'), // Hashing the password
            'role' => 'admin', // Role set to admin
        ]);

        // Create an Employee User
        User::create([
            'name' => 'Employee User',
            'email' => 'employee@example.com',
            'password' => bcrypt('password123'), // Hashing the password
            'role' => 'employee', // Role set to employee
        ]);
    }
}
