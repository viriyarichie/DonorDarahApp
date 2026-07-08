<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CertificateResource;
use App\Models\Certificate;
use App\Services\CertificateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class CertificateController extends Controller
{
    public function __construct(private CertificateService $certificateService) {}

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Certificate::with('user')->orderByDesc('created_at');

        if ($user->isPendonor()) {
            $query->where('user_id', $user->id);
        }

        $certificates = $query->paginate(10);

        return response()->json([
            'data' => CertificateResource::collection($certificates),
            'meta' => [
                'current_page' => $certificates->currentPage(),
                'last_page' => $certificates->lastPage(),
                'total' => $certificates->total(),
            ],
        ]);
    }

    public function request(Request $request): JsonResponse
    {
        $request->validate([
            'milestone' => 'required|integer|in:10,25,50,75,100',
        ], [
            'milestone.required' => 'Milestone wajib diisi.',
            'milestone.in' => 'Milestone tidak valid. Pilih salah satu dari: 10, 25, 50, 75, 100.',
        ]);

        $certificate = $this->certificateService->requestCertificate($request->user(), $request->milestone);

        return response()->json([
            'message' => 'Pengajuan sertifikat berhasil dikirim.',
            'data' => new CertificateResource($certificate),
        ], 201);
    }

    public function approve(Certificate $certificate): JsonResponse
    {
        $certificate = $this->certificateService->approveCertificate($certificate);
        return response()->json([
            'message' => 'Sertifikat berhasil disetujui.',
            'data' => new CertificateResource($certificate),
        ]);
    }

    public function reject(Certificate $certificate): JsonResponse
    {
        $certificate = $this->certificateService->rejectCertificate($certificate);
        return response()->json([
            'message' => 'Pengajuan sertifikat ditolak.',
            'data' => new CertificateResource($certificate),
        ]);
    }

    public function download(Request $request, Certificate $certificate): BinaryFileResponse
    {
        // Pastikan hanya pemilik sertifikat yang bisa download
        if ($request->user()->isPendonor() && $certificate->user_id !== $request->user()->id) {
            abort(403, 'Anda tidak memiliki akses ke sertifikat ini.');
        }

        if (!$certificate->file_path || !Storage::disk('public')->exists($certificate->file_path)) {
            abort(404, 'File sertifikat tidak ditemukan. Hubungi petugas PMI.');
        }

        return response()->download(
            Storage::disk('public')->path($certificate->file_path),
            'Sertifikat_Donor_PMI_' . $certificate->milestone . 'x_' . $certificate->user_id . '.pdf',
            ['Content-Type' => 'application/pdf']
        );
    }
}
