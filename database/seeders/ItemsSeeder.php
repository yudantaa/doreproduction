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
        DB::table('items')->insert([
            // SOUND SYSTEMS (Category 1)
            [
                'nama_barang' => 'Sound 1000 Watt',
                'id_kategori' => 1,
                'status' => 'Tersedia',
                'jumlah' => 3,
                'deskripsi' => "Capacity up to 50 Pax Participants. For mp3 playback and microphone purpose. Includes: 2 Unit Active Speaker Turbosound M12 or Yamaha DBR 12, 1 Unit Mixing Console Yamaha MG12XU, 2 Wireless Microphone, 2 Tripod Speaker, 2 Stand Microphone, Cable Required, Operator standby during event",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Sound 2000 Watt',
                'id_kategori' => 1,
                'status' => 'Tersedia',
                'jumlah' => 2,
                'deskripsi' => "Capacity up to 50 Pax Participants. For Simple Acoustic Purpose. Includes: 4 Unit Active Speaker Turbosound M12 or Yamaha DBR 12, 1 Unit Mixing Console Soundcraft Signature 16, 2 Wired Microphone Shure SM58, 2 Wireless Microphone, 2 Tripod Speaker, 2 Stand Microphone, 1 Stand Book, 1 Stand Guitar, 1 Stand Keyboard, 3 Unit Direct Box, Cable Required, Operator standby during event",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Sound 3000 Watt',
                'id_kategori' => 1,
                'status' => 'Tersedia',
                'jumlah' => 2,
                'deskripsi' => "Capacity up to 80 Pax Participants. For Simple Acoustic and DJ Purpose. Includes: 4 Unit Active Speaker Turbosound M12 or Yamaha DBR 12, 2 Unit Subwoofer Yamaha DSR 118, 1 Unit Mixing Console Yamaha MGP24X, 2 Wired Microphone Shure SM58, 2 Wireless Microphone, 2 Stand Microphone, 1 Stand Book, 2 Stand Guitar, 1 Stand Keyboard, 4 Unit Direct Box, Cable Required, Operator standby during event",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Sound 5000 Watt',
                'id_kategori' => 1,
                'status' => 'Tersedia',
                'jumlah' => 2,
                'deskripsi' => "Capacity up to 100 Pax Participants. For Full Band and DJ Purpose. Includes: 2 Unit Speaker PA FBT X Pro 15A, 2 Unit Subwoofer Yamaha DXS 18, 4 Unit Active Speaker Turbosound M12 or Yamaha DBR 12, 1 Unit Digital Mixer Midas M32, 1 Unit Stage Box DL32, 3 Wired Microphone Shure SM58, 4 Wireless Microphone, 3 Stand Microphone, 1 Stand Book, 2 Stand Guitar, 1 Stand Keyboard, 4 Unit Direct Box, Cable Required, Operator standby during event",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Sound 8000 Watt',
                'id_kategori' => 1,
                'status' => 'Tersedia',
                'jumlah' => 1,
                'deskripsi' => "Capacity up to 150 Pax Participants. For Full Band and DJ Purpose. Includes: 2 Unit Speaker PA FBT X Pro 15A, 4 Unit Subwoofer Yamaha DXS 18, 6 Unit Active Speaker Turbosound M12 or Yamaha DBR 12, 1 Unit Digital Mixer Midas M32, 1 Unit Stage Box DL32, 3 Wired Microphone Shure SM58, 4 Wireless Microphone, 3 Stand Microphone, 1 Stand book, 2 Stand Guitar, 1 Stand Keyboard, 4 Unit Direct Box, Cable Required, Operator standby during event",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Sound 10000 Watt',
                'id_kategori' => 1,
                'status' => 'Tersedia',
                'jumlah' => 1,
                'deskripsi' => "Capacity up to 250 Pax Participants. For Full Band and DJ Purpose. Includes: 4 Unit Speaker PA FBT X Pro 15A, 4 Unit Subwoofer Yamaha DXS 18, 6 Unit Active Speaker Turbosound M12 or Yamaha DBR 12, 1 Unit Digital Mixer Midas M32, 1 Unit Stage Box DL32, 4 Wired Microphone Shure SM58, 4 Wireless Microphone, 2 Stand Microphone, 1 Stand book, 2 Stand Guitar, 1 Stand Keyboard, 5 Unit Direct Box, Cable Required, Operator standby during event",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Speaker Monitor',
                'id_kategori' => 1,
                'status' => 'Tersedia',
                'jumlah' => 6,
                'deskripsi' => "Additional monitor speaker for stage monitoring",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Backline Amplifier Standard Set',
                'id_kategori' => 1,
                'status' => 'Tersedia',
                'jumlah' => 2,
                'deskripsi' => "Complete backline amplifier set for band performance",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Drumset',
                'id_kategori' => 1,
                'status' => 'Tersedia',
                'jumlah' => 2,
                'deskripsi' => "Complete drumset including mic & monitor speaker",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Digital Piano Roland RD 700',
                'id_kategori' => 1,
                'status' => 'Tersedia',
                'jumlah' => 1,
                'deskripsi' => "Professional digital piano for stage performance",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Wireless Microphone',
                'id_kategori' => 1,
                'status' => 'Tersedia',
                'jumlah' => 8,
                'deskripsi' => "Professional wireless microphone system",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Wireless Clip on/Headset',
                'id_kategori' => 1,
                'status' => 'Tersedia',
                'jumlah' => 4,
                'deskripsi' => "Professional wireless clip-on or headset microphone",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Mic Gooseneck Podium',
                'id_kategori' => 1,
                'status' => 'Tersedia',
                'jumlah' => 3,
                'deskripsi' => "Gooseneck microphone for podium use",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],

            // LIGHTING (Category 2)
            [
                'nama_barang' => 'Par Led RGBW 54',
                'id_kategori' => 2,
                'status' => 'Tersedia',
                'jumlah' => 12,
                'deskripsi' => "Professional RGBW LED par lights for stage lighting",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Fresnel Cob 200 watt',
                'id_kategori' => 2,
                'status' => 'Tersedia',
                'jumlah' => 4,
                'deskripsi' => "High power Fresnel COB light for stage illumination",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Moving Beam 300',
                'id_kategori' => 2,
                'status' => 'Tersedia',
                'jumlah' => 4,
                'deskripsi' => "Moving beam light for dynamic stage effects",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Follow Spot',
                'id_kategori' => 2,
                'status' => 'Tersedia',
                'jumlah' => 2,
                'deskripsi' => "Professional follow spot light for highlighting performers",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Hazer 1000 watt',
                'id_kategori' => 2,
                'status' => 'Tersedia',
                'jumlah' => 2,
                'deskripsi' => "High output hazer for atmospheric effects",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Disco Ball',
                'id_kategori' => 2,
                'status' => 'Tersedia',
                'jumlah' => 3,
                'deskripsi' => "Classic disco ball for party lighting effects",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Lazer 2 Eyes',
                'id_kategori' => 2,
                'status' => 'Tersedia',
                'jumlah' => 2,
                'deskripsi' => "Professional laser lighting effect",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Smoke Gun',
                'id_kategori' => 2,
                'status' => 'Tersedia',
                'jumlah' => 2,
                'deskripsi' => "Portable smoke effect machine",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Hanging Bulb',
                'id_kategori' => 2,
                'status' => 'Tersedia',
                'jumlah' => 50,
                'deskripsi' => "Decorative hanging bulbs for event decoration (per meter)",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],

            // GENERATOR (Category 3)
            [
                'nama_barang' => 'Generator 30 KVA',
                'id_kategori' => 3,
                'status' => 'Tersedia',
                'jumlah' => 2,
                'deskripsi' => "30 KVA generator with max 10 hours operation time",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Generator 40 KVA',
                'id_kategori' => 3,
                'status' => 'Tersedia',
                'jumlah' => 1,
                'deskripsi' => "40 KVA generator with max 10 hours operation time",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Generator 60 KVA',
                'id_kategori' => 3,
                'status' => 'Tersedia',
                'jumlah' => 1,
                'deskripsi' => "60 KVA generator with max 10 hours operation time",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Generator 80 KVA',
                'id_kategori' => 3,
                'status' => 'Tersedia',
                'jumlah' => 1,
                'deskripsi' => "80 KVA generator with max 10 hours operation time",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Generator 100 KVA',
                'id_kategori' => 3,
                'status' => 'Tersedia',
                'jumlah' => 1,
                'deskripsi' => "100 KVA generator with max 10 hours operation time",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],

            // ADDITIONAL ITEMS (Category 4)
            [
                'nama_barang' => 'Folding Stage Platform',
                'id_kategori' => 4,
                'status' => 'Tersedia',
                'jumlah' => 6,
                'deskripsi' => "Modular folding stage platform system",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Event Tent 6x6m',
                'id_kategori' => 4,
                'status' => 'Tersedia',
                'jumlah' => 4,
                'deskripsi' => "Professional event tent for outdoor activities",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Truss System 4m',
                'id_kategori' => 4,
                'status' => 'Tersedia',
                'jumlah' => 8,
                'deskripsi' => "Professional aluminum truss system",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],

            // OTHER ITEMS (Category 5)
            [
                'nama_barang' => 'Pyro Tech',
                'id_kategori' => 5,
                'status' => 'Tersedia',
                'jumlah' => 10,
                'deskripsi' => "Pyrotechnic effects for stage performances",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Pyro Wheels',
                'id_kategori' => 5,
                'status' => 'Tersedia',
                'jumlah' => 2,
                'deskripsi' => "Rotating pyrotechnic wheel effects",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Confetti Machine',
                'id_kategori' => 5,
                'status' => 'Tersedia',
                'jumlah' => 2,
                'deskripsi' => "Confetti machine for special effects (per unit per shot)",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Dry ice',
                'id_kategori' => 5,
                'status' => 'Tersedia',
                'jumlah' => 5,
                'deskripsi' => "Dry ice for special fog effects",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Walkie Talkie',
                'id_kategori' => 5,
                'status' => 'Tersedia',
                'jumlah' => 12,
                'deskripsi' => "Communication devices for event crew",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Sound Card Focusrite 2/2',
                'id_kategori' => 5,
                'status' => 'Tersedia',
                'jumlah' => 3,
                'deskripsi' => "Professional audio interface for recording and streaming",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Capture Card Rexus 4k',
                'id_kategori' => 5,
                'status' => 'Tersedia',
                'jumlah' => 2,
                'deskripsi' => "4K video capture card for live streaming",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
            [
                'nama_barang' => 'Solidoom hollyland 6s',
                'id_kategori' => 5,
                'status' => 'Tersedia',
                'jumlah' => 1,
                'deskripsi' => "Wireless video transmission system",
                'created_at' => $this->randomDate(),
                'updated_at' => $this->randomDate(),
            ],
        ]);
    }
}
