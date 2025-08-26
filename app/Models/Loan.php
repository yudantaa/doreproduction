<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    protected $fillable = [
        'nama_penyewa',
        'no_tlp_penyewa',
        'id_item_unit',
        'tanggal_sewa',
        'tanggal_kembali',
        'deadline_pengembalian',
        'status',
    ];

    protected $casts = [
        'tanggal_sewa' => 'datetime',
        'tanggal_kembali' => 'datetime',
        'deadline_pengembalian' => 'datetime',
    ];

    public function itemUnit()
    {
        return $this->belongsTo(ItemUnit::class, 'id_item_unit');
    }
}