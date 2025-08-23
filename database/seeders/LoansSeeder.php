<?php

namespace Database\Seeders;

use App\Models\ItemUnit;
use App\Models\Loan;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LoansSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all available item units
        $availableUnits = ItemUnit::where('status', 'Tersedia')->get();

        if ($availableUnits->isEmpty()) {
            $this->command->info('No available units found. Skipping loan seeding.');
            return;
        }

        // Borrower name pool
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

        $startDate = Carbon::create(2023, 1, 1);
        $endDate = Carbon::create(2025, 8, 31);
        $currentDate = $startDate->copy();

        $loans = [];

        while ($currentDate->lte($endDate)) {
            $loanCount = rand(1, 10);

            for ($i = 0; $i < $loanCount; $i++) {
                // Skip if no available units
                if ($availableUnits->isEmpty()) {
                    continue;
                }

                $randomUnit = $availableUnits->random();
                $borrower = $borrowers[array_rand($borrowers)];
                $phone = '08' . str_pad((string) rand(100000000, 999999999), 9, '0', STR_PAD_LEFT);

                // Random loan date within the current month
                $loanDate = Carbon::create(
                    $currentDate->year,
                    $currentDate->month,
                    rand(1, $currentDate->daysInMonth)
                );

                // Deadline: 3-7 days after loan date
                $deadline = $loanDate->copy()->addDays(rand(3, 7));

                // Determine status and return date
                if (rand(0, 1)) { // 50% chance of being returned
                    $returnDate = $loanDate->copy()->addDays(rand(1, 14));

                    if ($returnDate->lte($deadline)) {
                        $status = 'Dikembalikan';
                    } else {
                        $status = 'Dikembalikan'; // Late returns still marked as returned
                    }
                } else if (rand(0, 4) === 0) { // 20% chance of being canceled
                    $returnDate = $loanDate->copy()->addDays(rand(0, 2));
                    $status = 'Dibatalkan';
                } else {
                    $returnDate = null;
                    $status = 'Disewa';
                }

                // Update unit status
                $randomUnit->update(['status' => 'Disewa']);

                $loans[] = [
                    'nama_penyewa' => $borrower,
                    'no_tlp_penyewa' => $phone,
                    'id_item_unit' => $randomUnit->id,
                    'tanggal_sewa' => $loanDate->toDateString(),
                    'tanggal_kembali' => $returnDate ? $returnDate->toDateString() : null,
                    'deadline_pengembalian' => $deadline->toDateString(),
                    'status' => $status,
                    'created_at' => $loanDate,
                    'updated_at' => $returnDate ?? $loanDate,
                ];

                // Remove the used unit from available units
                $availableUnits = $availableUnits->filter(function ($unit) use ($randomUnit) {
                    return $unit->id !== $randomUnit->id;
                });
            }

            $currentDate->addMonth();
        }

        // Insert all generated loans
        DB::table('loans')->insert($loans);

        // Update status of all item units based on their loan status
        foreach (ItemUnit::all() as $unit) {
            $activeLoan = Loan::where('id_item_unit', $unit->id)
                ->where('status', 'Disewa')
                ->exists();

            if (!$activeLoan) {
                $unit->update(['status' => 'Tersedia']);
            }
        }
    }
}