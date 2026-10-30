<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->string('member_code', 32)->unique();
            $table->string('name');
            $table->string('nik', 16)->unique();
            $table->string('phone', 20);
            $table->text('address');
            $table->decimal('current_balance', 14, 2)->default(0.00);
            $table->decimal('total_co2e_saved_kg', 12, 2)->default(0.00);
            $table->timestamps();
        });

        Schema::create('waste_deposits', function (Blueprint $table) {
            $table->id();
            $table->string('deposit_code', 32)->unique();
            $table->foreignId('member_id')->constrained('members')->cascadeOnDelete();
            $table->enum('category', ['PLASTIK', 'KERTAS', 'LOGAM', 'KACA', 'ORGANIK']);
            $table->decimal('weight_kg', 10, 2);
            $table->decimal('unit_price_idr', 10, 2);
            $table->decimal('total_amount_idr', 12, 2);
            $table->decimal('co2e_factor', 6, 2);
            $table->decimal('co2e_avoided_kg', 10, 2);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_code', 32)->unique();
            $table->foreignId('member_id')->constrained('members')->cascadeOnDelete();
            $table->enum('type', ['DEPOSIT', 'WITHDRAWAL']);
            $table->decimal('amount_idr', 12, 2);
            $table->decimal('balance_after_idr', 14, 2);
            $table->decimal('co2e_offset_kg', 10, 2)->default(0.00);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('waste_deposits');
        Schema::dropIfExists('members');
    }
};
