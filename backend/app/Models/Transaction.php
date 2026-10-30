<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    protected $table = 'transactions';

    protected $fillable = [
        'transaction_code',
        'member_id',
        'type', // DEPOSIT, WITHDRAWAL
        'amount_idr',
        'balance_after_idr',
        'co2e_offset_kg',
        'notes'
    ];

    protected $casts = [
        'amount_idr' => 'decimal:2',
        'balance_after_idr' => 'decimal:2',
        'co2e_offset_kg' => 'decimal:2',
    ];

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'member_id');
    }
}
