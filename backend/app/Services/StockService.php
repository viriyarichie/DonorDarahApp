<?php

namespace App\Services;

use App\Models\Stock;
use App\Models\Location;

class StockService
{
    public function getAllStocks(array $filters = [])
    {
        $query = Stock::with('location');

        if (!empty($filters['location_id'])) {
            $query->where('location_id', $filters['location_id']);
        }

        if (!empty($filters['blood_type'])) {
            $query->where('blood_type', $filters['blood_type']);
        }

        return $query->get();
    }

    public function updateStock(Stock $stock, int $amount): Stock
    {
        $stock->update(['amount' => $amount]);
        return $stock->fresh('location');
    }

    public function createStock(array $data): Stock
    {
        // Cek jika sudah ada stock untuk golongan darah dan lokasi ini
        $existing = Stock::where('blood_type', $data['blood_type'])
            ->where('location_id', $data['location_id'])
            ->first();

        if ($existing) {
            $existing->update(['amount' => $data['amount']]);
            return $existing->fresh('location');
        }

        return Stock::create($data)->load('location');
    }

    public function getSummary(): array
    {
        $stocks = Stock::all();
        $summary = [];

        foreach (['A', 'B', 'AB', 'O'] as $type) {
            $typeStocks = $stocks->where('blood_type', $type);
            $total = $typeStocks->sum('amount');
            $summary[$type] = [
                'total' => $total,
                'status' => $total >= 20 ? 'aman' : ($total >= 10 ? 'perlu_perhatian' : 'kritis'),
            ];
        }

        return $summary;
    }
}
