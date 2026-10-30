<?php

namespace App\Http\Controllers\Api;

use App\Models\Member;
use App\Models\WasteDeposit;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class WasteDepositController
{
    private const CATEGORY_RATES = [
        'PLASTIK' => ['price' => 3500, 'co2e' => 1.85],
        'KERTAS'  => ['price' => 2200, 'co2e' => 1.15],
        'LOGAM'   => ['price' => 8500, 'co2e' => 4.20],
        'KACA'    => ['price' => 1200, 'co2e' => 0.35],
        'ORGANIK' => ['price' => 800,  'co2e' => 0.50],
    ];

    public function index(): JsonResponse
    {
        $transactions = Transaction::with('member')->orderBy('id', 'desc')->paginate(50);
        return response()->json([
            'status' => 'success',
            'data' => $transactions
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
            'items' => 'required|array|min:1',
            'items.*.category' => 'required|string|in:PLASTIK,KERTAS,LOGAM,KACA,ORGANIK',
            'items.*.weight_kg' => 'required|numeric|min:0.05',
            'notes' => 'nullable|string'
        ]);

        return DB::transaction(function () use ($validated) {
            $member = Member::lockForUpdate()->findOrFail($validated['member_id']);
            $totalAmount = 0;
            $totalCo2e = 0;

            foreach ($validated['items'] as $item) {
                $rates = self::CATEGORY_RATES[$item['category']];
                $amt = $item['weight_kg'] * $rates['price'];
                $co2 = $item['weight_kg'] * $rates['co2e'];

                $totalAmount += $amt;
                $totalCo2e += $co2;

                WasteDeposit::create([
                    'deposit_code' => 'DEP-' . uniqid(),
                    'member_id' => $member->id,
                    'category' => $item['category'],
                    'weight_kg' => $item['weight_kg'],
                    'unit_price_idr' => $rates['price'],
                    'total_amount_idr' => $amt,
                    'co2e_factor' => $rates['co2e'],
                    'co2e_avoided_kg' => $co2,
                    'notes' => $validated['notes'] ?? null
                ]);
            }

            $member->current_balance += $totalAmount;
            $member->total_co2e_saved_kg += $totalCo2e;
            $member->save();

            $tx = Transaction::create([
                'transaction_code' => 'TX-' . str_pad((Transaction::count() + 1), 5, '0', STR_PAD_LEFT),
                'member_id' => $member->id,
                'type' => 'DEPOSIT',
                'amount_idr' => $totalAmount,
                'balance_after_idr' => $member->current_balance,
                'co2e_offset_kg' => $totalCo2e,
                'notes' => $validated['notes'] ?? 'Setoran Sampah Daur Ulang'
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Waste deposit processed successfully',
                'data' => [
                    'transaction' => $tx,
                    'member' => $member
                ]
            ], 201);
        });
    }

    public function withdraw(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
            'amount_idr' => 'required|numeric|min:1000',
            'notes' => 'nullable|string'
        ]);

        return DB::transaction(function () use ($validated) {
            $member = Member::lockForUpdate()->findOrFail($validated['member_id']);

            if ($member->current_balance < $validated['amount_idr']) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Insufficient balance for withdrawal'
                ], 422);
            }

            $member->current_balance -= $validated['amount_idr'];
            $member->save();

            $tx = Transaction::create([
                'transaction_code' => 'TX-' . str_pad((Transaction::count() + 1), 5, '0', STR_PAD_LEFT),
                'member_id' => $member->id,
                'type' => 'WITHDRAWAL',
                'amount_idr' => $validated['amount_idr'],
                'balance_after_idr' => $member->current_balance,
                'co2e_offset_kg' => 0.00,
                'notes' => $validated['notes'] ?? 'Penarikan Saldo Tabungan Tunai'
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Withdrawal completed successfully',
                'data' => [
                    'transaction' => $tx,
                    'member' => $member
                ]
            ]);
        });
    }
}
