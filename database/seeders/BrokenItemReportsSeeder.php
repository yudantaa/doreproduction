<?php

namespace Database\Seeders;

use App\Models\BrokenItemReport;
use App\Models\Item;
use App\Models\ItemUnit;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class BrokenItemReportsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all items that have available units
        $items = Item::where('status', 'Tersedia')
            ->whereHas('itemUnits', function ($query) {
                $query->where('status', 'Tersedia');
            })
            ->get();

        // Get admin users who can report broken items
        $users = User::whereIn('role', ['ADMIN', 'SUPER ADMIN'])->get();

        if ($items->isEmpty() || $users->isEmpty()) {
            return;
        }

        $descriptions = [
            'Barang tidak berfungsi saat dinyalakan',
            'Ada bagian yang rusak fisik',
            'Tidak menghasilkan suara',
            'Layar tidak menyala',
            'Tombol tidak berfungsi',
            'Kabel putus',
            'Overheat saat digunakan',
            'Baterai tidak bisa diisi ulang',
            'Koneksi tidak stabil',
            'Kualitas suara buruk'
        ];

        $repairNotes = [
            'Sedang dalam proses perbaikan oleh teknisi',
            'Menunggu spare part dari supplier',
            'Perbaikan selesai, barang berfungsi normal',
            'Barang tidak bisa diperbaiki karena kerusakan parah',
            'Biaya perbaikan terlalu tinggi, lebih baik beli baru'
        ];

        // Create 20-30 broken item reports
        $reportCount = rand(20, 30);

        for ($i = 0; $i < $reportCount; $i++) {
            $item = $items->random();
            $reporter = $users->random();

            // Get an available unit for this item
            $availableUnit = ItemUnit::where('id_barang', $item->id)
                ->where('status', 'Tersedia')
                ->inRandomOrder()
                ->first();

            if (!$availableUnit) {
                continue; // Skip if no available unit found
            }

            // Random date within the last 6 months
            $createdAt = Carbon::now()->subDays(rand(0, 180))
                ->subHours(rand(0, 23))
                ->subMinutes(rand(0, 59));

            $status = $this->getWeightedRandomStatus();

            $report = BrokenItemReport::create([
                'id_item_unit' => $availableUnit->id, // Changed from id_unit to id_item_unit
                'id_pelapor' => $reporter->id,
                'description' => $descriptions[array_rand($descriptions)],
                'status' => $status,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);

            // Update unit status if reported
            if ($status === 'reported') {
                $availableUnit->update([
                    'status' => 'Rusak',
                    'updated_at' => $createdAt
                ]);

                // Update item status if no more available units
                $availableUnitsCount = ItemUnit::where('id_barang', $item->id)
                    ->where('status', 'Tersedia')
                    ->count();

                if ($availableUnitsCount === 0) {
                    $item->update([
                        'status' => 'Tidak Tersedia',
                        'updated_at' => $createdAt
                    ]);
                }
            }

            // For non-reported statuses, add additional details
            if (in_array($status, ['in_repair', 'repaired', 'rejected'])) {
                $updatedAt = $createdAt->copy()->addDays(rand(1, 14));

                $report->update([
                    'repair_notes' => $repairNotes[array_rand($repairNotes)],
                    'updated_at' => $updatedAt,
                ]);

                // For repaired items, sometimes assign a repair requester
                if ($status === 'repaired' && rand(0, 1)) {
                    $admin = $users->where('id', '!=', $reporter->id)->random();
                    $report->update([
                        'id_pelapor' => $admin->id,
                        'repair_requested_at' => $createdAt->copy()->addDays(rand(1, 7)),
                    ]);

                    // Mark unit as repaired and available again
                    $availableUnit->update([
                        'status' => 'Tersedia',
                        'updated_at' => $updatedAt
                    ]);

                    // Update item status to available
                    $item->update([
                        'status' => 'Tersedia',
                        'updated_at' => $updatedAt
                    ]);
                }

                // For rejected reports, mark unit as available again
                if ($status === 'rejected') {
                    $availableUnit->update([
                        'status' => 'Tersedia',
                        'updated_at' => $updatedAt
                    ]);

                    // Update item status to available
                    $item->update([
                        'status' => 'Tersedia',
                        'updated_at' => $updatedAt
                    ]);
                }
            }
        }
    }

    /**
     * Get weighted random status (more reported statuses)
     */
    private function getWeightedRandomStatus(): string
    {
        $weights = [
            'reported' => 50,    // Higher chance for new reports
            'in_repair' => 20,
            'repaired' => 20,
            'rejected' => 10
        ];

        $total = array_sum($weights);
        $random = rand(1, $total);
        $current = 0;

        foreach ($weights as $status => $weight) {
            $current += $weight;
            if ($random <= $current) {
                return $status;
            }
        }

        return 'reported';
    }
}
