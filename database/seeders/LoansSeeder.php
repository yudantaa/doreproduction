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
                'nama_penyewa' => 'Yudanta Agasta',
                'no_tlp_penyewa' => '089522734461',
                'id_barang' => 1,
                'tanggal_sewa' => now()->subDays(7),
                'tanggal_kembali' => null,
                'deadline_pengembalian' => now()->addDays(7),
                'status' => 'Disewa',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_penyewa' => 'Turtle Emperor',
                'no_tlp_penyewa' => '082173035412',
                'id_barang' => 2,
                'tanggal_sewa' => now()->subDays(5),
                'tanggal_kembali' => now()->addDays(5),
                'deadline_pengembalian' => now()->addDays(7),
                'status' => 'Dikembalikan',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
