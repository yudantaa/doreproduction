<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ItemsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('items')->insert([
            [
                'nama_barang' => 'Sound 1000 Watt',
                'id_kategori' => 1, // Kategori "Sound System"
                'status' => 'tersedia',
                'jumlah' => 5, // Contoh jumlah barang
                'deskripsi' => "
                    Capacity up to 50 Pax Participants.
                    For mp3 playback and microphone purpose.
                    Specification:
                    - 2 Unit Active Speaker Turbosound M12 or Yamaha DBR 12
                    - 1 Unit Mixing Console Yamaha MG12XU
                    - 2 Wireless Microphone
                    - 2 Tripod Speaker
                    - 2 Stand Microphone
                    - Cable Required
                    - Operator standby during event
                ",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_barang' => 'Sound 2000 Watt',
                'id_kategori' => 1, // Kategori "Sound System"
                'status' => 'tersedia',
                'jumlah' => 5, // Contoh jumlah barang
                'deskripsi' => "
                    Capacity up to 50 Pax Participants.
                    For Simple Acoustic Purpose.
                    Specification:
                    - 4 Unit Active Speaker Turbosound M12 or Yamaha DBR 12
                    - 1 Unit Mixing Console Soundcraft Signature 16
                    - 2 Wired Microphone Shure SM58
                    - 2 Wireless Microphone
                    - 2 Tripod Speaker
                    - 2 Stand Microphone
                    - 1 Stand Book
                    - 1 Stand Guitar
                    - 1 Stand Keyboard
                    - 3 Unit Direct Box
                    - Cable Required
                    - Operator standby during event
                ",
                'created_at' => now(),
                'updated_at' => now(),
            ],
         ]);
    }
}
