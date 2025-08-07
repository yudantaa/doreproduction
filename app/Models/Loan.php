<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    protected $fillable = [
        'nama_penyewa',
        'no_tlp_penyewa',
        'tanggal_sewa',
        'tanggal_kembali',
        'deadline_pengembalian',
        'status',
        'id_barang'
    ];


    // Relasi ke tabel items
    public function item()
    {
        return $this->belongsTo(Item::class, 'id_barang');
    }
}