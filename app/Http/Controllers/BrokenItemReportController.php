<?php

namespace App\Http\Controllers;

use App\Models\BrokenItemReport;
use App\Models\Item;
use App\Models\User;
use App\Notifications\BrokenItemReported;
use App\Notifications\BrokenItemStatusUpdated;
use App\Notifications\RepairRequested;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Storage;

class BrokenItemReportController extends Controller
{
    public function index(Request $request)
    {
        $query = BrokenItemReport::with(['item', 'reporter'])
            ->latest();

        if ($request->has('search') && $request->search) {
            $query->whereHas('item', function ($q) use ($request) {
                $q->where('nama_barang', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Remove pagination and get all results
        $reports = $query->get();

        return Inertia::render('broken-items/broken-item-index', [
            'reports' => $reports,
            'canRequestRepair' => auth()->user()->role === 'ADMIN',
        ]);
    }

    public function show(BrokenItemReport $report)
    {
        $report->load(['item', 'reporter', 'repairRequester']);

        return Inertia::render('broken-items/show-broken-item', [
            'report' => $report,
            'canUpdateStatus' => auth()->user()->role === 'SUPER ADMIN',
        ]);
    }

    public function create()
    {
        // Get all available items (you might want to filter this)
        $items = Item::where('jumlah', '>', 0)
            ->where('status', '!=', 'Sedang Ditahan')
            ->get(['id', 'nama_barang']);

        return Inertia::render('broken-items/create-form', [
            'items' => $items,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_id' => 'required|exists:items,id',
            'description' => 'required|string|max:1000',
            'proof_image' => 'nullable|image|max:5120',
        ]);

        $item = Item::findOrFail($validated['item_id']);

        if ($item->status === 'Sedang Ditahan') {
            return redirect()
                ->back()
                ->with('error', 'Item ini sudah dilaporkan rusak sebelumnya');
        }

        if ($item->jumlah > 0) {
            $item->decrement('jumlah');
        }

        $item->status = $item->jumlah > 0 ? 'Tersedia' : 'Tidak Tersedia';
        $item->save();

        $imagePath = null;
        if ($request->hasFile('proof_image')) {
            $imagePath = $request->file('proof_image')->store('broken-items-proofs', 'public');
        }

        $report = BrokenItemReport::create([
            'item_id' => $validated['item_id'],
            'reporter_id' => Auth::id(),
            'description' => $validated['description'],
            'proof_image_path' => $imagePath,
            'status' => 'reported',
        ]);

        $superAdmins = User::where('role', 'SUPER ADMIN')->get();
        foreach ($superAdmins as $admin) {
            $admin->notify(new BrokenItemReported($report));
        }

        return redirect()
            ->route('dashboard.broken-items.index')
            ->with('success', 'Barang rusak berhasil dilaporkan. Stok berkurang 1.');
    }

    public function updateStatus(Request $request, BrokenItemReport $report)
    {
        $request->validate([
            'status' => 'required|in:in_repair,repaired,rejected',
            'notes' => 'nullable|string|max:1000',
        ]);

        $report->update([
            'status' => $request->status,
            'repair_notes' => $request->notes ?? $report->repair_notes,
        ]);

        $item = $report->item;

        if ($request->status === 'repaired') {
            // If repaired, increase stock by 1
            $item->increment('jumlah');

            // Update status based on new stock count
            if ($item->jumlah > 0) {
                $item->status = 'Tersedia';
            } else {
                $item->status = 'Tidak Tersedia';
            }
        } elseif ($request->status === 'rejected') {
            // If rejected, increase stock by 1 (since we reduced it when reported)
            $item->increment('jumlah');

            // Update status based on new stock count
            if ($item->jumlah > 0) {
                $item->status = 'Tersedia';
            } else {
                $item->status = 'Tidak Tersedia';
            }
        }
        // For 'in_repair' status, don't change stock or status

        $item->save();

        $report->reporter->notify(new BrokenItemStatusUpdated($report));
        if ($report->repair_requester_id) {
            $report->repairRequester->notify(new BrokenItemStatusUpdated($report));
        }

        return redirect()->back()->with('success', 'Status updated successfully.');
    }
}
