<?php

namespace App\Http\Controllers\Api;

use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MemberController
{
    public function index(): JsonResponse
    {
        $members = Member::orderBy('id', 'desc')->get();
        return response()->json([
            'status' => 'success',
            'data' => $members
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nik' => 'required|string|size:16|unique:members,nik',
            'phone' => 'required|string|max:20',
            'address' => 'required|string'
        ]);

        $code = 'MBR-' . str_pad((Member::count() + 1), 3, '0', STR_PAD_LEFT);

        $member = Member::create([
            'member_code' => $code,
            'name' => $validated['name'],
            'nik' => $validated['nik'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'current_balance' => 0.00,
            'total_co2e_saved_kg' => 0.00
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Member successfully onboarded',
            'data' => $member
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $member = Member::with(['deposits', 'transactions'])->findOrFail($id);
        return response()->json([
            'status' => 'success',
            'data' => $member
        ]);
    }
}
