<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BrokenItemReport extends Model
{
    protected $fillable = [
        'id_item_unit',
        'id_pelapor',
        'description',
        'proof_image_path',
        'status',
        'repair_notes',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function itemUnit()
    {
        return $this->belongsTo(ItemUnit::class, 'id_item_unit');
    }

    public function item()
    {
        return $this->hasOneThrough(Item::class, ItemUnit::class, 'id', 'id', 'id_item_unit', 'id_barang');
    }

    public function reporter()
    {
        return $this->belongsTo(User::class, 'id_pelapor');
    }


    public function getItemNameAttribute()
    {
        return $this->itemUnit?->item?->nama_barang;
    }

    // Helper method to get unit code
    public function getUnitCodeAttribute()
    {
        return $this->itemUnit?->kode_unit;
    }
}