<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = [
        'nama_barang',
        'status',
        'jumlah',
        'deskripsi',
        'id_kategori',
        'image'
    ];

    // Relasi ke kategori
    public function category()
    {
        return $this->belongsTo(Category::class, 'id_kategori');
    }
    public function loans()
    {
        return $this->hasMany(Loan::class, 'id_barang');
    }

}
