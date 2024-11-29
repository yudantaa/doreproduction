<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LoansSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('loans')->insert([
            [
                'nama_peminjam' => 'Yudanta Agasta',
                'no_tlp_peminjam' => '089522734461',
                'id_barang' => 1, // Sound 1000 Watt
                'tanggal_pinjam' => now()->subDays(7),
                'tanggal_kembali' => now()->addDays(7),
                'status' => 'dipinjam',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_peminjam' => 'Turtle Emperor',
                'no_tlp_peminjam' => '082173035412',
                'id_barang' => 2, // Sound 3000 Watt
                'tanggal_pinjam' => now()->subDays(5),
                'tanggal_kembali' => null,
                'status' => 'dipinjam',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
