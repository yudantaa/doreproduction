<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the categories.
     */
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

    /**
     * Show the form for creating a new Category.
     */
    public function create()
    {
        return Inertia::render(component: 'category/create-form');
    }

    // /**
    //  * Store a newly created Category in storage.
    //  */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_kategori' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories', 'nama_kategori')
            ]
        ]);

        Category::create([
            'nama_kategori' => $validated['nama_kategori']
        ]);

        return redirect()->route('categories.index')->with('success', 'Category created successfully.');
    }

    /**
     * Show the form for editing the specified Category.
     */
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
        $validated = $request->validate([
            'nama_kategori' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories', 'nama_kategori')->ignore($category->id)
            ]
        ]);

        $category->update([
            'nama_kategori' => $validated['nama_kategori']
        ]);

        return redirect()->route('categories.index')->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified Category from storage.
     */
    public function destroy(Category $Category)
    {
        $Category->delete();

        return redirect()->route('categories.index')->with('success', 'Category deleted successfully.');
    }
}