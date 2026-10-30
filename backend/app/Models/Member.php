<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Member extends Model
{
    protected $table = 'members';

    protected $fillable = [
        'member_code',
        'name',
        'nik',
        'phone',
        'address',
        'current_balance',
        'total_co2e_saved_kg'
    ];

    protected $casts = [
        'current_balance' => 'decimal:2',
        'total_co2e_saved_kg' => 'decimal:2',
    ];

    public function deposits(): HasMany
    {
        return $this->hasMany(WasteDeposit::class, 'member_id');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'member_id');
    }
}
