<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemUnit extends Model
{
    protected $fillable = [
        'id_barang',
        'kode_unit',
        'status',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class, 'id_barang');
    }

    public function loans()
    {
        return $this->hasMany(Loan::class, 'id_item_unit');
    }

    public function brokenItemReports()
    {
        return $this->hasMany(BrokenItemReport::class, 'id_item_unit');
    }
}