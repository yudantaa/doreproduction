<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    protected $fillable = [
        'nama_peminjam',
        'no_tlp_peminjam',
        'tanggal_pinjam',
        'tanggal_kembali',
        'status',
        'id_barang'
    ];


    // Relasi ke tabel items
    public function item()
    {
        return $this->belongsTo(Item::class, 'id_barang');
    }
}
