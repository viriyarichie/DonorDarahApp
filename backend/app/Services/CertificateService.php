<?php

namespace App\Services;

use App\Models\Certificate;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class CertificateService
{
    public function requestCertificate(User $user, int $milestone): Certificate
    {
        $donorCount = $user->getDonorCount();

        if ($donorCount < $milestone) {
            throw ValidationException::withMessages([
                'milestone' => ["Anda belum mencapai {$milestone} kali donor. Total donor Anda saat ini: {$donorCount}"],
            ]);
        }

        // Cek apakah sudah ada sertifikat untuk milestone ini
        $existing = Certificate::where('user_id', $user->id)
            ->where('milestone', $milestone)
            ->first();

        if ($existing) {
            throw ValidationException::withMessages([
                'milestone' => ["Sertifikat untuk milestone {$milestone} kali donor sudah pernah diajukan."],
            ]);
        }

        return Certificate::create([
            'milestone' => $milestone,
            'status' => 'pending',
            'user_id' => $user->id,
        ]);
    }

    public function approveCertificate(Certificate $certificate): Certificate
    {
        $filePath = $this->generatePdf($certificate);

        $certificate->update([
            'status' => 'disetujui',
            'issue_date' => now(),
            'file_path' => $filePath,
        ]);

        \App\Models\Notification::create([
            'title' => 'Sertifikat Disetujui',
            'message' => "Sertifikat penghargaan {$certificate->milestone} kali donor Anda telah disetujui dan siap diunduh.",
            'type' => 'penghargaan',
            'user_id' => $certificate->user_id,
        ]);

        return $certificate->fresh('user');
    }

    public function rejectCertificate(Certificate $certificate): Certificate
    {
        $certificate->update(['status' => 'ditolak']);

        \App\Models\Notification::create([
            'title' => 'Pengajuan Sertifikat Ditolak',
            'message' => "Mohon maaf, pengajuan sertifikat {$certificate->milestone} kali donor Anda ditolak. Silakan hubungi petugas PMI.",
            'type' => 'penghargaan',
            'user_id' => $certificate->user_id,
        ]);

        return $certificate->fresh('user');
    }

    private function generatePdf(Certificate $certificate): string
    {
        // Pastikan relasi user ter-load
        if (!$certificate->relationLoaded('user')) {
            $certificate->load('user');
        }

        $user = $certificate->user;

        $pdf = Pdf::loadView('pdf.certificate', [
            'certificate' => $certificate,
            'user'        => $user,
            'donor_count' => $user->getDonorCount(),
        ])
        ->setPaper('a4', 'landscape')
        ->setOptions([
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled'      => false,
            'defaultFont'          => 'serif',
            'dpi'                  => 150,
        ]);

        // Pastikan direktori ada
        $dir = 'certificates';
        \Illuminate\Support\Facades\Storage::disk('public')->makeDirectory($dir);

        $fileName = $dir . '/sertifikat_' . $user->id . '_' . $certificate->milestone . '_' . time() . '.pdf';
        \Illuminate\Support\Facades\Storage::disk('public')->put($fileName, $pdf->output());

        return $fileName;
    }
}
