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
    ];

    // Relasi ke tabel users (opsional jika id_user disimpan di tabel loans)
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    // Relasi ke tabel items
    public function item()
    {
        return $this->belongsTo(Item::class, 'id_barang');
    }
}
