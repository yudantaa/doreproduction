<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    protected $fillable = [
        'nama_penyewa',
        'no_tlp_penyewa',
        'item_unit_id',
        'tanggal_sewa',
        'tanggal_kembali',
        'deadline_pengembalian',
        'status',
    ];

    public function itemUnit()
    {
        return $this->belongsTo(ItemUnit::class, 'id_item_unit');
    }
}