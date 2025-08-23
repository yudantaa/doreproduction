<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ItemsSeeder extends Seeder
{
    /**
     * Generate random dates between 2023-2025
     */
    private function randomDate()
    {
        $startDate = Carbon::create(2023, 1, 1);
        $endDate = Carbon::create(2025, 12, 31);
        return $startDate->copy()->addDays(rand(0, $endDate->diffInDays($startDate)));
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            // SOUND SYSTEMS (Category 1)
            [
                'nama_barang' => 'Sound 1000 Watt',
                'base_code' => 'S1K',
                'id_kategori' => 1,
                'status' => 'Tersedia',
                'deskripsi' => "Capacity up to 50 Pax Participants. For mp3 playback and microphone purpose. Includes: 2 Unit Active Speaker Turbosound M12 or Yamaha DBR 12, 1 Unit Mixing Console Yamaha MG12XU, 2 Wireless Microphone, 2 Tripod Speaker, 2 Stand Microphone, Cable Required, Operator standby during event",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Sound 2000 Watt',
                'base_code' => 'S2K',
                'id_kategori' => 1,
                'status' => 'Tersedia',
                'deskripsi' => "Capacity up to 50 Pax Participants. For Simple Acoustic Purpose. Includes: 4 Unit Active Speaker Turbosound M12 or Yamaha DBR 12, 1 Unit Mixing Console Soundcraft Signature 16, 2 Wired Microphone Shure SM58, 2 Wireless Microphone, 2 Tripod Speaker, 2 Stand Microphone, 1 Stand Book, 1 Stand Guitar, 1 Stand Keyboard, 3 Unit Direct Box, Cable Required, Operator standby during event",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Sound 3000 Watt',
                'base_code' => 'S3K',
                'id_kategori' => 1,
                'status' => 'Tersedia',
                'deskripsi' => "Capacity up to 80 Pax Participants. For Simple Acoustic and DJ Purpose. Includes: 4 Unit Active Speaker Turbosound M12 or Yamaha DBR 12, 2 Unit Subwoofer Yamaha DSR 118, 1 Unit Mixing Console Yamaha MGP24X, 2 Wired Microphone Shure SM58, 2 Wireless Microphone, 2 Stand Microphone, 1 Stand Book, 2 Stand Guitar, 1 Stand Keyboard, 4 Unit Direct Box, Cable Required, Operator standby during event",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Sound 5000 Watt',
                'base_code' => 'S5K',
                'id_kategori' => 1,
                'status' => 'Tersedia',
                'deskripsi' => "Capacity up to 100 Pax Participants. For Full Band and DJ Purpose. Includes: 2 Unit Speaker PA FBT X Pro 15A, 2 Unit Subwoofer Yamaha DXS 18, 4 Unit Active Speaker Turbosound M12 or Yamaha DBR 12, 1 Unit Digital Mixer Midas M32, 1 Unit Stage Box DL32, 3 Wired Microphone Shure SM58, 4 Wireless Microphone, 3 Stand Microphone, 1 Stand Book, 2 Stand Guitar, 1 Stand Keyboard, 4 Unit Direct Box, Cable Required, Operator standby during event",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Sound 8000 Watt',
                'base_code' => 'S8K',
                'id_kategori' => 1,
                'status' => 'Tersedia',
                'deskripsi' => "Capacity up to 150 Pax Participants. For Full Band and DJ Purpose. Includes: 2 Unit Speaker PA FBT X Pro 15A, 4 Unit Subwoofer Yamaha DXS 18, 6 Unit Active Speaker Turbosound M12 or Yamaha DBR 12, 1 Unit Digital Mixer Midas M32, 1 Unit Stage Box DL32, 3 Wired Microphone Shure SM58, 4 Wireless Microphone, 3 Stand Microphone, 1 Stand book, 2 Stand Guitar, 1 Stand Keyboard, 4 Unit Direct Box, Cable Required, Operator standby during event",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Sound 10000 Watt',
                'base_code' => 'S10K',
                'id_kategori' => 1,
                'status' => 'Tersedia',
                'deskripsi' => "Capacity up to 250 Pax Participants. For Full Band and DJ Purpose. Includes: 4 Unit Speaker PA FBT X Pro 15A, 4 Unit Subwoofer Yamaha DXS 18, 6 Unit Active Speaker Turbosound M12 or Yamaha DBR 12, 1 Unit Digital Mixer Midas M32, 1 Unit Stage Box DL32, 4 Wired Microphone Shure SM58, 4 Wireless Microphone, 2 Stand Microphone, 1 Stand book, 2 Stand Guitar, 1 Stand Keyboard, 5 Unit Direct Box, Cable Required, Operator standby during event",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Speaker Monitor',
                'base_code' => 'SPM',
                'id_kategori' => 1,
                'status' => 'Tersedia',
                'deskripsi' => "Additional monitor speaker for stage monitoring",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Backline Amplifier Standard Set',
                'base_code' => 'BLA',
                'id_kategori' => 1,
                'status' => 'Tersedia',
                'deskripsi' => "Complete backline amplifier set for band performance",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Drumset',
                'base_code' => 'DRM',
                'id_kategori' => 1,
                'status' => 'Tersedia',
                'deskripsi' => "Complete drumset including mic & monitor speaker",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Digital Piano Roland RD 700',
                'base_code' => 'DPR',
                'id_kategori' => 1,
                'status' => 'Tersedia',
                'deskripsi' => "Professional digital piano for stage performance",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Wireless Microphone',
                'base_code' => 'WMS',
                'id_kategori' => 1,
                'status' => 'Tersedia',
                'deskripsi' => "Professional wireless microphone system",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Wireless Clip on/Headset',
                'base_code' => 'WCH',
                'id_kategori' => 1,
                'status' => 'Tersedia',
                'deskripsi' => "Professional wireless clip-on or headset microphone",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Mic Gooseneck Podium',
                'base_code' => 'MGP',
                'id_kategori' => 1,
                'status' => 'Tersedia',
                'deskripsi' => "Gooseneck microphone for podium use",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],

            // LIGHTING (Category 2)
            [
                'nama_barang' => 'Par Led RGBW 54',
                'base_code' => 'PLR',
                'id_kategori' => 2,
                'status' => 'Tersedia',
                'deskripsi' => "Professional RGBW LED par lights for stage lighting",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Fresnel Cob 200 watt',
                'base_code' => 'FCB',
                'id_kategori' => 2,
                'status' => 'Tersedia',
                'deskripsi' => "High power Fresnel COB light for stage illumination",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Moving Beam 300',
                'base_code' => 'MVB',
                'id_kategori' => 2,
                'status' => 'Tersedia',
                'deskripsi' => "Moving beam light for dynamic stage effects",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Follow Spot',
                'base_code' => 'FSP',
                'id_kategori' => 2,
                'status' => 'Tersedia',
                'deskripsi' => "Professional follow spot light for highlighting performers",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Hazer 1000 watt',
                'base_code' => 'HZR',
                'id_kategori' => 2,
                'status' => 'Tersedia',
                'deskripsi' => "High output hazer for atmospheric effects",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Disco Ball',
                'base_code' => 'DCB',
                'id_kategori' => 2,
                'status' => 'Tersedia',
                'deskripsi' => "Classic disco ball for party lighting effects",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Lazer 2 Eyes',
                'base_code' => 'LZE',
                'id_kategori' => 2,
                'status' => 'Tersedia',
                'deskripsi' => "Professional laser lighting effect",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Smoke Gun',
                'base_code' => 'SMK',
                'id_kategori' => 2,
                'status' => 'Tersedia',
                'deskripsi' => "Portable smoke effect machine",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Hanging Bulb',
                'base_code' => 'HGB',
                'id_kategori' => 2,
                'status' => 'Tersedia',
                'deskripsi' => "Decorative hanging bulbs for event decoration (per meter)",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],

            // GENERATOR (Category 3)
            [
                'nama_barang' => 'Generator 30 KVA',
                'base_code' => 'G30',
                'id_kategori' => 3,
                'status' => 'Tersedia',
                'deskripsi' => "30 KVA generator with max 10 hours operation time",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Generator 40 KVA',
                'base_code' => 'G40',
                'id_kategori' => 3,
                'status' => 'Tersedia',
                'deskripsi' => "40 KVA generator with max 10 hours operation time",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Generator 60 KVA',
                'base_code' => 'G60',
                'id_kategori' => 3,
                'status' => 'Tersedia',
                'deskripsi' => "60 KVA generator with max 10 hours operation time",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Generator 80 KVA',
                'base_code' => 'G80',
                'id_kategori' => 3,
                'status' => 'Tersedia',
                'deskripsi' => "80 KVA generator with max 10 hours operation time",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Generator 100 KVA',
                'base_code' => 'G100',
                'id_kategori' => 3,
                'status' => 'Tersedia',
                'deskripsi' => "100 KVA generator with max 10 hours operation time",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],

            // ADDITIONAL ITEMS (Category 4)
            [
                'nama_barang' => 'Folding Stage Platform',
                'base_code' => 'FSP',
                'id_kategori' => 4,
                'status' => 'Tersedia',
                'deskripsi' => "Modular folding stage platform system",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Event Tent 6x6m',
                'base_code' => 'ET6',
                'id_kategori' => 4,
                'status' => 'Tersedia',
                'deskripsi' => "Professional event tent for outdoor activities",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Truss System 4m',
                'base_code' => 'TSM',
                'id_kategori' => 4,
                'status' => 'Tersedia',
                'deskripsi' => "Professional aluminum truss system",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],

            // OTHER ITEMS (Category 5)
            [
                'nama_barang' => 'Pyro Tech',
                'base_code' => 'PYT',
                'id_kategori' => 5,
                'status' => 'Tersedia',
                'deskripsi' => "Pyrotechnic effects for stage performances",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Pyro Wheels',
                'base_code' => 'PYW',
                'id_kategori' => 5,
                'status' => 'Tersedia',
                'deskripsi' => "Rotating pyrotechnic wheel effects",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Confetti Machine',
                'base_code' => 'CFM',
                'id_kategori' => 5,
                'status' => 'Tersedia',
                'deskripsi' => "Confetti machine for special effects (per unit per shot)",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Dry ice',
                'base_code' => 'DRI',
                'id_kategori' => 5,
                'status' => 'Tersedia',
                'deskripsi' => "Dry ice for special fog effects",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Walkie Talkie',
                'base_code' => 'WKT',
                'id_kategori' => 5,
                'status' => 'Tersedia',
                'deskripsi' => "Communication devices for event crew",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Sound Card Focusrite 2/2',
                'base_code' => 'SCF',
                'id_kategori' => 5,
                'status' => 'Tersedia',
                'deskripsi' => "Professional audio interface for recording and streaming",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Capture Card Rexus 4k',
                'base_code' => 'CCR',
                'id_kategori' => 5,
                'status' => 'Tersedia',
                'deskripsi' => "4K video capture card for live streaming",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Solidoom hollyland 6s',
                'base_code' => 'SH6',
                'id_kategori' => 5,
                'status' => 'Tersedia',
                'deskripsi' => "Wireless video transmission system",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
        ];

        // Insert items
        foreach ($items as $item) {
            DB::table('items')->insert($item);
        }
    }
}
