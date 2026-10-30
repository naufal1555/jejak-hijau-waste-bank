<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WasteDeposit extends Model
{
    protected $table = 'waste_deposits';

    protected $fillable = [
        'deposit_code',
        'member_id',
        'category',
        'weight_kg',
        'unit_price_idr',
        'total_amount_idr',
        'co2e_factor',
        'co2e_avoided_kg',
        'notes'
    ];

    protected $casts = [
        'weight_kg' => 'decimal:2',
        'unit_price_idr' => 'decimal:2',
        'total_amount_idr' => 'decimal:2',
        'co2e_avoided_kg' => 'decimal:2',
    ];

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'member_id');
    }
}
