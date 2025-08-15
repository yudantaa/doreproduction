<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BrokenItemReport extends Model
{
    protected $fillable = [
        'item_id',
        'reporter_id',
        'description',
        'proof_image_path',
        'status',
        'repair_notes',
        'repair_requester_id',
        'repair_requested_at'
    ];

    protected $casts = [
        'repair_requested_at' => 'datetime',
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function repairRequester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'repair_requester_id');
    }
}