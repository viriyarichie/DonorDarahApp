<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StockRequest;
use App\Http\Resources\StockResource;
use App\Models\Stock;
use App\Services\StockService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StockController extends Controller
{
    public function __construct(private StockService $stockService) {}

    public function index(Request $request): JsonResponse
    {
        $stocks = $this->stockService->getAllStocks($request->only(['location_id', 'blood_type']));
        $summary = $this->stockService->getSummary();

        return response()->json([
            'data' => StockResource::collection($stocks),
            'summary' => $summary,
        ]);
    }

    public function store(StockRequest $request): JsonResponse
    {
        $stock = $this->stockService->createStock($request->validated());
        return response()->json([
            'message' => 'Stok darah berhasil ditambahkan.',
            'data' => new StockResource($stock),
        ], 201);
    }

    public function update(StockRequest $request, Stock $stock): JsonResponse
    {
        $stock = $this->stockService->updateStock($stock, $request->amount);
        return response()->json([
            'message' => 'Stok darah berhasil diperbarui.',
            'data' => new StockResource($stock),
        ]);
    }

    public function destroy(Stock $stock): JsonResponse
    {
        $stock->delete();
        return response()->json(['message' => 'Stok darah berhasil dihapus.']);
    }
}
