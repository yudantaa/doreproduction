<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    public function index()
    {
        return Inertia::render('category/category-index', [
            'categories' => Category::all()->map(fn($Category) => [
                'id' => $Category->id,
                'nama_kategori' => $Category->nama_kategori,
                'created_at' => $Category->created_at->format('Y-m-d H:i:s')
            ])
        ]);
    }

    public function create()
    {
        return Inertia::render(component: 'category/create-form');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_kategori' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-zA-Z0-9\s\-_&]+$/',
                Rule::unique('categories', 'nama_kategori')
            ]
        ]);

        try {
            DB::beginTransaction();

            $category = Category::create([
                'nama_kategori' => trim($validated['nama_kategori'])
            ]);

            DB::commit();

            // Send notification AFTER successful creation
            $this->sendCategoryCreatedNotification($category);

            return redirect()->route('categories.index')->with('success', 'Kategori berhasil dibuat.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat membuat kategori: ' . $e->getMessage()]);
        }
    }

    public function edit(Category $Category)
    {
        return Inertia::render('Category/Category-edit', [
            'Category' => [
                'id' => $Category->id,
                'nama_kategori' => $Category->nama_kategori,
            ]
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $oldName = $category->nama_kategori;

        $validated = $request->validate([
            'nama_kategori' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-zA-Z0-9\s\-_&]+$/',
                Rule::unique('categories', 'nama_kategori')->ignore($category->id)
            ]
        ]);

        try {
            DB::beginTransaction();

            $category->update([
                'nama_kategori' => trim($validated['nama_kategori'])
            ]);

            DB::commit();

            // Send notification AFTER successful update
            $this->sendCategoryUpdatedNotification($category, $oldName);

            return redirect()->route('categories.index')->with('success', 'Kategori berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat memperbarui kategori: ' . $e->getMessage()]);
        }
    }

    public function destroy(Category $category)
    {
        // Check if category has associated items
        if ($category->items()->exists()) {
            return redirect()->route('categories.index')
                ->with('error', 'Kategori tidak dapat dihapus karena masih memiliki barang yang terkait.');
        }

        try {
            DB::beginTransaction();

            $categoryData = [
                'id' => $category->id,
                'nama_kategori' => $category->nama_kategori
            ];

            $category->delete();

            DB::commit();

            // Send notification AFTER successful deletion
            $this->sendCategoryDeletedNotification($categoryData);

            return redirect()->route('categories.index')->with('success', 'Kategori berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat menghapus kategori: ' . $e->getMessage()]);
        }
    }

    private function sendCategoryCreatedNotification(Category $category)
    {
        try {
            $message = "<b>📁 KATEGORI BARU</b>\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

            $message .= "<b>📋 DETAIL KATEGORI:</b>\n";
            $message .= "• ID: <code>#{$category->id}</code>\n";
            $message .= "• Nama Kategori: <b>{$category->nama_kategori}</b>\n\n";

            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
            $message .= "🕒 <i>Dibuat: " . $category->created_at->format('d/m/Y • H:i') . " WITA</i>";

            (new TelegramBotController)->sendMessage($message);
        } catch (\Exception $e) {
            \Log::error('Failed to send category created notification: ' . $e->getMessage());
        }
    }

    private function sendCategoryUpdatedNotification(Category $category, string $oldName)
    {
        try {
            $message = "<b>🔄 KATEGORI DIPERBARUI</b>\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

            $message .= "<b>📋 DETAIL KATEGORI:</b>\n";
            $message .= "• ID: <code>#{$category->id}</code>\n";
            $message .= "• Nama Sebelumnya: <i>{$oldName}</i>\n";
            $message .= "• Nama Terbaru: <b>{$category->nama_kategori}</b>\n\n";

            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
            $message .= "🕒 <i>Diperbarui: " . now()->format('d/m/Y • H:i') . " WITA</i>";

            (new TelegramBotController)->sendMessage($message);
        } catch (\Exception $e) {
            \Log::error('Failed to send category updated notification: ' . $e->getMessage());
        }
    }

    private function sendCategoryDeletedNotification(array $categoryData)
    {
        try {
            $message = "<b>🗑️ KATEGORI DIHAPUS</b>\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

            $message .= "<b>📋 DETAIL KATEGORI:</b>\n";
            $message .= "• ID: <code>#{$categoryData['id']}</code>\n";
            $message .= "• Nama Kategori: <b>{$categoryData['nama_kategori']}</b>\n\n";

            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
            $message .= "🕒 <i>Dihapus: " . now()->format('d/m/Y • H:i') . " WITA</i>";

            (new TelegramBotController)->sendMessage($message);
        } catch (\Exception $e) {
            \Log::error('Failed to send category deleted notification: ' . $e->getMessage());
        }
    }
}
