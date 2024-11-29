<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'nama_kategori',
        'deskripsi',
    ];

    // Relasi ke tabel items
    public function items()
    {
        return $this->hasMany(Item::class, 'id_kategori');
    }
}
