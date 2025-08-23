<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ItemUnitsSeeder extends Seeder
{
    /**
     * Get the quantity for each item based on the original seeder data
     */
    private function getJumlahForItem($namaBarang)
    {
        $quantities = [
            'Sound 1000 Watt' => 3,
            'Sound 2000 Watt' => 2,
            'Sound 3000 Watt' => 2,
            'Sound 5000 Watt' => 2,
            'Sound 8000 Watt' => 1,
            'Sound 10000 Watt' => 1,
            'Speaker Monitor' => 6,
            'Backline Amplifier Standard Set' => 2,
            'Drumset' => 2,
            'Digital Piano Roland RD 700' => 1,
            'Wireless Microphone' => 8,
            'Wireless Clip on/Headset' => 4,
            'Mic Gooseneck Podium' => 3,
            'Par Led RGBW 54' => 12,
            'Fresnel Cob 200 watt' => 4,
            'Moving Beam 300' => 4,
            'Follow Spot' => 2,
            'Hazer 1000 watt' => 2,
            'Disco Ball' => 3,
            'Lazer 2 Eyes' => 2,
            'Smoke Gun' => 2,
            'Hanging Bulb' => 50,
            'Generator 30 KVA' => 2,
            'Generator 40 KVA' => 1,
            'Generator 60 KVA' => 1,
            'Generator 80 KVA' => 1,
            'Generator 100 KVA' => 1,
            'Folding Stage Platform' => 6,
            'Event Tent 6x6m' => 4,
            'Truss System 4m' => 8,
            'Pyro Tech' => 10,
            'Pyro Wheels' => 2,
            'Confetti Machine' => 2,
            'Dry ice' => 5,
            'Walkie Talkie' => 12,
            'Sound Card Focusrite 2/2' => 3,
            'Capture Card Rexus 4k' => 2,
            'Solidoom hollyland 6s' => 1,
        ];

        return $quantities[$namaBarang] ?? 1;
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all items with their base codes
        $items = DB::table('items')->get();

        // Track used base codes to ensure uniqueness
        $usedBaseCodes = [];

        foreach ($items as $item) {
            $quantity = $this->getJumlahForItem($item->nama_barang);

            // Check if base code is already used
            if (in_array($item->base_code, $usedBaseCodes)) {
                // Append item ID to base code to make it unique
                $uniqueBaseCode = $item->base_code . $item->id;
            } else {
                $uniqueBaseCode = $item->base_code;
                $usedBaseCodes[] = $item->base_code;
            }

            for ($i = 1; $i <= $quantity; $i++) {
                DB::table('item_units')->insert([
                    'id_barang' => $item->id,
                    'kode_unit' => $uniqueBaseCode . '-' . str_pad($i, 3, '0', STR_PAD_LEFT),
                    'status' => 'Tersedia',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
