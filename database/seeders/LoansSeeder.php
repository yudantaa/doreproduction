<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class LoansSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Keep the original item IDs (do not change)
        $itemIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20];

        // Borrower name pool (based on names from your original seeder)
        $borrowers = [
            'Putu Streaming Studio',
            'Seminyak Wedding Venue',
            'Wayan Krisna',
            'Sanur Beach Hotel',
            'Kadek Rian',
            'Canggu Music Festival',
            'Wayan Outdoor Event',
            'Komang Artika',
            'Made Dharma',
            'Nyoman Late Organizer',
            'Yudanta Agasta',
            'Ubud Cultural Center',
            'Kuta Party Organizer',
            'Turtle Emperor',
            'Bali Wedding Planner',
            'Jimbaran Corporate Event',
            'Gede Music Production',
            'Denpasar Festival Committee',
            'Ketut Surya Event Organizer',
            'Ketut Delayed',
            'Nyoman Adi',
            'Made Construction Co.'
        ];

        $start = Carbon::create(2023, 1, 1);
        $end = Carbon::create(2025, 8, 31);

        $current = $start->copy();
        $data = [];

        while ($current->lte($end)) {
            $loanCount = rand(1, 10);
            $daysInMonth = $current->daysInMonth;

            for ($i = 0; $i < $loanCount; $i++) {
                $day = rand(1, $daysInMonth);
                $loanDate = Carbon::create($current->year, $current->month, $day);

                // Deadline: 3-7 days after loan date
                $deadline = $loanDate->copy()->addDays(rand(3, 7));

                // Actual return: 1-14 days after loan date
                $returnDate = $loanDate->copy()->addDays(rand(1, 14));

                // Determine status:
                // - If return date is in the future -> Disewa (still rented)
                // - If returned on/before deadline -> Dikembalikan
                // - If would have been late, now randomly choose between Dibatalkan or Disewa
                if ($returnDate->lte(Carbon::now())) {
                    if ($returnDate->lte($deadline)) {
                        $status = 'Dikembalikan';
                    } else {
                        // Replace "Terlambat" with either "Dibatalkan" or "Disewa"
                        $status = rand(0, 1) ? 'Dibatalkan' : 'Disewa';
                    }
                    $updatedAt = $returnDate->toDateTimeString();
                } else {
                    $status = 'Disewa';
                    $updatedAt = Carbon::now()->toDateTimeString();
                }

                $borrower = $borrowers[array_rand($borrowers)];
                // simple random phone; not tied to borrower to keep it simple
                $noTlp = '08' . str_pad((string) rand(100000000, 999999999), 9, '0', STR_PAD_LEFT);

                $data[] = [
                    'nama_penyewa' => $borrower,
                    'no_tlp_penyewa' => $noTlp,
                    'id_barang' => $itemIds[array_rand($itemIds)],
                    'tanggal_sewa' => $loanDate->toDateString(),
                    'tanggal_kembali' => $returnDate->toDateString(),
                    'deadline_pengembalian' => $deadline->toDateString(),
                    'status' => $status,
                    'created_at' => $loanDate->toDateTimeString(),
                    'updated_at' => $updatedAt,
                ];
            }

            $current->addMonth();
        }

        // Insert generated data
        DB::table('loans')->insert($data);
    }
}
