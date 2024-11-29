<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the categories.
     */
    public function index()
    {
        return Inertia::render('category/category-index', [
            'categories' => Category::all()->map(fn ($Category) => [
                'id' => $Category->id,
                'nama_kategori' => $Category->nama_kategori,
                'created_at' => $Category->created_at->format('Y-m-d H:i:s')
            ])
        ]);
    }

    // /**
    //  * Show the form for creating a new Category.
    //  */
    // public function create()
    // {
    //     return Inertia::render('Category/Category-create');
    // }

    // /**
    //  * Store a newly created Category in storage.
    //  */
    // public function store(Request $request)
    // {
    //     $validated = $request->validate([
    //         'name' => 'required|string|max:255',
    //         'email' => 'required|email|unique:categories,email',
    //         'password' => 'required|string|min:8|confirmed',
    //         'role' => 'nullable|string|max:255',
    //     ]);

    //     Category::create([
    //         'name' => $validated['name'],
    //         'email' => $validated['email'],
    //         'password' => Hash::make($validated['password']),
    //         'role' => $validated['role'] ?? 'ADMIN',
    //     ]);

    //     return redirect()->route('categories.index')->with('success', 'Category created successfully.');
    // }

    // /**
    //  * Show the form for editing the specified Category.
    //  */
    // public function edit(Category $Category)
    // {
    //     return Inertia::render('Category/Category-edit', [
    //         'Category' => [
    //             'id' => $Category->id,
    //             'name' => $Category->name,
    //             'email' => $Category->email,
    //             'role' => $Category->role,
    //         ]
    //     ]);
    // }

    // /**
    //  * Update the specified Category in storage.
    //  */
    // public function update(Request $request, Category $Category)
    // {
    //     $validated = $request->validate([
    //         'name' => 'required|string|max:255',
    //         'email' => "required|email|unique:categories,email,{$Category->id}",
    //         // 'password' => 'nullable|string|min:8|confirmed',
    //         'role' => 'nullable|string|max:255',
    //     ]);

    //     $Category->update([
    //         'name' => $validated['name'],
    //         'email' => $validated['email'],
    //         // 'password' => $validated['password'] ? Hash::make($validated['password']) : $Category->password,
    //         'role' => $validated['role'] ?? $Category->role,
    //     ]);

    //     return redirect()->route('categories.index')->with('success', 'Category updated successfully.');
    // }

    /**
     * Remove the specified Category from storage.
     */
    public function destroy(Category $Category)
    {
        $Category->delete();

        return redirect()->route('categories.index')->with('success', 'Category deleted successfully.');
    }
}
