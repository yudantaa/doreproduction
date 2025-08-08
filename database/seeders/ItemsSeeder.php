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
            // SOUND SYSTEMS
            [
                'nama_barang' => 'Sound 1000 Watt',
                'id_kategori' => 1, // Kategori "Sound System"
                'status' => 'Tersedia',
                'jumlah' => 3,
                'deskripsi' => "
                    Capacity up to 50 Pax Participants.
                    For mp3 playback and microphone purpose.
                    Price: IDR 1.250.000
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
                'status' => 'Tersedia',
                'jumlah' => 2,
                'deskripsi' => "
                    Capacity up to 100 Pax Participants.
                    For Simple Acoustic Purpose.
                    Price: IDR 1.750.000
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
            [
                'nama_barang' => 'Sound 3000 Watt',
                'id_kategori' => 1, // Kategori "Sound System"
                'status' => 'Tersedia',
                'jumlah' => 2,
                'deskripsi' => "
                    Capacity up to 150 Pax Participants.
                    For medium scale events and performances.
                    Price: IDR 2.750.000
                    Specification:
                    - 6 Unit Active Speaker
                    - 1 Unit Professional Mixing Console
                    - 4 Wireless Microphone
                    - 4 Wired Microphone
                    - Speaker stands and rigging
                    - Complete cable set
                    - Audio processing equipment
                    - Professional operator standby during event
                ",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_barang' => 'Sound 5000 Watt',
                'id_kategori' => 1, // Kategori "Sound System"
                'status' => 'Tersedia',
                'jumlah' => 2,
                'deskripsi' => "
                    Capacity up to 250 Pax Participants.
                    For large scale events and concerts.
                    Price: IDR 3.500.000
                    Specification:
                    - 8 Unit Professional Active Speaker
                    - 1 Unit Digital Mixing Console 24 Channel
                    - 6 Wireless Microphone System
                    - 4 Wired Microphone Shure SM58
                    - Professional speaker rigging system
                    - Audio processor and equalizer
                    - Monitor system
                    - Complete professional cable set
                    - Professional sound engineer standby during event
                ",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_barang' => 'Sound 8000 Watt',
                'id_kategori' => 1, // Kategori "Sound System"
                'status' => 'Tersedia',
                'jumlah' => 1,
                'deskripsi' => "
                    Capacity up to 400 Pax Participants.
                    For concert and festival grade events.
                    Price: IDR 5.000.000
                    Specification:
                    - 12 Unit Professional Line Array Speaker
                    - 1 Unit Digital Mixing Console 32 Channel
                    - 8 Wireless Microphone System
                    - 6 Wired Microphone Professional Grade
                    - Professional rigging and truss system
                    - Multi-zone audio processing
                    - Professional monitor system
                    - Complete touring grade cable set
                    - Professional sound engineer team standby during event
                ",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_barang' => 'Sound 10000 Watt',
                'id_kategori' => 1, // Kategori "Sound System"
                'status' => 'Tersedia',
                'jumlah' => 1,
                'deskripsi' => "
                    Capacity up to 500+ Pax Participants.
                    For major concert and festival events.
                    Price: IDR 6.000.000
                    Specification:
                    - 16 Unit Professional Line Array Speaker System
                    - 1 Unit Digital Mixing Console 48 Channel
                    - 10 Wireless Microphone System
                    - 8 Wired Microphone Professional Grade
                    - Professional stage rigging and truss system
                    - Advanced audio processing and effects
                    - Professional monitor and side-fill system
                    - Complete concert grade cable infrastructure
                    - Professional sound engineer team with assistant
                ",
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // LIGHTING & LAMP DECORATION
            [
                'nama_barang' => 'Basic Stage Lighting',
                'id_kategori' => 2, // Kategori "Lighting"
                'status' => 'Tersedia',
                'jumlah' => 5,
                'deskripsi' => "
                    Basic stage lighting package for small events.
                    Includes:
                    - 8 Unit LED Par Light
                    - 1 Unit DMX Controller
                    - Color filters and gobos
                    - Lighting stands and clamps
                    - DMX cables
                    - Basic lighting operator
                ",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_barang' => 'Professional Stage Lighting',
                'id_kategori' => 2, // Kategori "Lighting"
                'status' => 'Tersedia',
                'jumlah' => 3,
                'deskripsi' => "
                    Professional lighting system for medium to large events.
                    Includes:
                    - 16 Unit LED Moving Head
                    - 12 Unit LED Par Light
                    - 4 Unit LED Strobe Light
                    - 1 Unit Professional DMX Controller
                    - Fog machine with fluid
                    - Professional lighting truss system
                    - Complete DMX cable network
                    - Professional lighting operator
                ",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_barang' => 'Decorative String Lights',
                'id_kategori' => 2, // Kategori "Lighting"
                'status' => 'Tersedia',
                'jumlah' => 10,
                'deskripsi' => "
                    Warm white LED string lights for decoration.
                    Perfect for weddings and outdoor events.
                    Includes:
                    - 100 meters LED string lights
                    - Power distribution system
                    - Weather-resistant connections
                    - Installation hardware
                ",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_barang' => 'Party Light Package',
                'id_kategori' => 2, // Kategori "Lighting"
                'status' => 'Tersedia',
                'jumlah' => 4,
                'deskripsi' => "
                    Fun lighting package for parties and celebrations.
                    Includes:
                    - 4 Unit LED Disco Ball
                    - 4 Unit Color Changing Par Light
                    - 2 Unit Laser Light
                    - 1 Unit Simple DMX Controller
                    - Mounting hardware
                    - Basic operator setup
                ",
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // MULTIMEDIA
            [
                'nama_barang' => 'Projector & Screen Package',
                'id_kategori' => 3, // Kategori "Multimedia"
                'status' => 'Tersedia',
                'jumlah' => 4,
                'deskripsi' => "
                    Complete projection solution for presentations.
                    Includes:
                    - 1 Unit 4000 Lumens Projector
                    - 1 Unit 3x2m Projection Screen
                    - HDMI and VGA cables
                    - Wireless presentation device
                    - Projector stand or ceiling mount
                    - Technical operator support
                ",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_barang' => 'LED Video Wall',
                'id_kategori' => 3, // Kategori "Multimedia"
                'status' => 'Tersedia',
                'jumlah' => 1,
                'deskripsi' => "
                    Professional LED video wall for large events.
                    Specifications:
                    - 3x2m P3.91 LED Panel System
                    - 4K resolution capability
                    - Professional video processor
                    - Complete mounting system
                    - Multiple input connections
                    - Professional video technician
                ",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_barang' => 'Live Streaming Setup',
                'id_kategori' => 3, // Kategori "Multimedia"
                'status' => 'Tersedia',
                'jumlah' => 2,
                'deskripsi' => "
                    Complete live streaming solution.
                    Includes:
                    - 3 Unit Professional Cameras
                    - 1 Unit Video Mixer
                    - Audio interface for streaming
                    - Encoder and streaming software
                    - Internet connectivity support
                    - Professional streaming operator
                ",
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // GENERATOR
            [
                'nama_barang' => 'Generator 5 KVA',
                'id_kategori' => 4, // Kategori "Generator"
                'status' => 'Tersedia',
                'jumlah' => 3,
                'deskripsi' => "
                    5 KVA Silent Generator for small to medium equipment.
                    Specifications:
                    - 5000 Watt continuous power
                    - Silent operation (less than 65dB)
                    - Automatic voltage regulator
                    - Fuel efficiency optimized
                    - Multiple output sockets
                    - Includes fuel for 8 hours operation
                ",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_barang' => 'Generator 10 KVA',
                'id_kategori' => 4, // Kategori "Generator"
                'status' => 'Tersedia',
                'jumlah' => 2,
                'deskripsi' => "
                    10 KVA Generator for medium to large equipment setup.
                    Specifications:
                    - 10000 Watt continuous power
                    - Low noise operation
                    - Digital control panel
                    - Automatic start/stop system
                    - Weather-resistant housing
                    - Professional power distribution box
                    - Includes fuel for 8 hours operation
                ",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_barang' => 'Generator 20 KVA',
                'id_kategori' => 4, // Kategori "Generator"
                'status' => 'Tersedia',
                'jumlah' => 1,
                'deskripsi' => "
                    20 KVA Generator for large scale events.
                    Specifications:
                    - 20000 Watt continuous power
                    - Industrial grade reliability
                    - Advanced digital monitoring
                    - Automatic transfer switch compatible
                    - Professional installation required
                    - Complete power distribution system
                    - Includes fuel for 8 hours operation
                ",
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // OTHER ITEMS
            [
                'nama_barang' => 'Wireless Microphone System',
                'id_kategori' => 5, // Kategori "Other Items"
                'status' => 'Tersedia',
                'jumlah' => 8,
                'deskripsi' => "
                    Professional wireless microphone system.
                    Includes:
                    - 2 Channel wireless receiver
                    - 2 Handheld wireless microphones
                    - 2 Bodypack transmitters
                    - 2 Lavalier microphones
                    - Rechargeable battery system
                    - Carrying case
                ",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_barang' => 'Folding Stage Platform',
                'id_kategori' => 5, // Kategori "Other Items"
                'status' => 'Tersedia',
                'jumlah' => 6,
                'deskripsi' => "
                    Modular folding stage platform system.
                    Specifications:
                    - 2x1m platform modules
                    - Height adjustable legs (60-100cm)
                    - Non-slip surface
                    - Weather-resistant material
                    - Quick setup and breakdown
                    - Safety rails available
                ",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_barang' => 'Event Tent 6x6m',
                'id_kategori' => 5, // Kategori "Other Items"
                'status' => 'Tersedia',
                'jumlah' => 4,
                'deskripsi' => "
                    Professional event tent for outdoor activities.
                    Specifications:
                    - 6x6 meter coverage
                    - Waterproof and UV resistant
                    - Aluminum frame structure
                    - Side walls available
                    - Professional installation included
                    - Suitable for all weather conditions
                ",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_barang' => 'Truss System 4m',
                'id_kategori' => 5, // Kategori "Other Items"
                'status' => 'Tersedia',
                'jumlah' => 8,
                'deskripsi' => "
                    Professional aluminum truss system.
                    Specifications:
                    - 4 meter straight truss sections
                    - Load capacity up to 200kg per section
                    - Quick-lock connection system
                    - Compatible with lighting and audio rigging
                    - Includes corner and T-joints
                    - Professional rigging hardware
                ",
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}