<?php

namespace App\Http\Controllers\Api;

use App\Models\WasteDeposit;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;

class CarbonImpactController
{
    private const TREE_ANNUAL_ABSORPTION_KG = 21.77;

    public function getSummary(): JsonResponse
    {
        $totalWeight = WasteDeposit::sum('weight_kg');
        $totalCo2e = WasteDeposit::sum('co2e_avoided_kg');
        $totalDepositVal = Transaction::where('type', 'DEPOSIT')->sum('amount_idr');
        $treeEquiv = $totalCo2e > 0 ? round($totalCo2e / self::TREE_ANNUAL_ABSORPTION_KG, 2) : 0;

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_waste_collected_kg' => round($totalWeight, 2),
                'total_co2e_avoided_kg' => round($totalCo2e, 2),
                'tree_equivalent_credits' => $treeEquiv,
                'total_deposit_value_idr' => $totalDepositVal,
                'methodology' => 'IPCC/EPA Tier 1 Emission Factors'
            ]
        ]);
    }

    public function getCategoryBreakdown(): JsonResponse
    {
        $breakdown = WasteDeposit::selectRaw('category, SUM(weight_kg) as total_kg, SUM(co2e_avoided_kg) as total_co2e, SUM(total_amount_idr) as total_val')
            ->groupBy('category')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $breakdown
        ]);
    }
}
