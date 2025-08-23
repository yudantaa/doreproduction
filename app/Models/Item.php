<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = [
        'nama_barang',
        'status',
        'deskripsi',
        'id_kategori',
        'base_code',
        'image'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'id_kategori');
    }

    public function itemUnits()
    {
        return $this->hasMany(ItemUnit::class, 'id_barang');
    }

    public function availableUnits()
    {
        return $this->hasMany(ItemUnit::class, 'id_barang')->where('status', 'Tersedia');
    }
}
