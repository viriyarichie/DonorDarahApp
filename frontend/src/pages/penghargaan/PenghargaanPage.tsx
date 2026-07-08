import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Award, Download, CheckCircle, Clock, XCircle, Trophy,
  ShieldCheck, Filter, AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import certificateService from '../../services/certificateService';
import donorService from '../../services/donorService';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { PageSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import api from '../../services/api';
import toast from 'react-hot-toast';

const milestones = [10, 25, 50, 75, 100];

/* ─────────────────────────────────────────────
   PENDONOR VIEW – milestone progress + request
───────────────────────────────────────────── */
const PendonorPenghargaan = () => {
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const uid = user?.id;
  const [requesting, setRequesting] = useState<number | null>(null);

  const { data: statsData } = useQuery({
    queryKey: ['donor-stats', uid],
    queryFn: () => donorService.getStats(),
  });

  const { data: certData, isLoading } = useQuery({
    queryKey: ['certificates', uid],
    queryFn: () => certificateService.getAll(),
  });

  const requestMutation = useMutation({
    mutationFn: (milestone: number) => certificateService.request(milestone),
    onSuccess: () => {
      toast.success('Pengajuan sertifikat berhasil dikirim!');
      setRequesting(null);
      qc.invalidateQueries({ queryKey: ['certificates', uid] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.errors?.milestone?.[0] || 'Gagal mengajukan sertifikat.';
      toast.error(msg);
      setRequesting(null);
    },
  });

  const stats = statsData?.data?.data;
  const totalDonor = stats?.total_donor || 0;
  const certs = certData?.data?.data || [];

  const handleDownload = (cert: any, milestone: number) => {
    const filename = `Sertifikat_Donor_PMI_${milestone}x.pdf`;

    if (cert.file_url) {
      // Fetch sebagai blob agar browser trigger download, bukan buka di tab baru
      fetch(cert.file_url)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.blob();
        })
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
        })
        .catch(() => {
          // Fallback: gunakan API endpoint dengan auth header
          api.get(`/certificates/${cert.id}/download`, { responseType: 'blob' })
            .then((res) => {
              const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
              const link = document.createElement('a');
              link.href = url;
              link.download = filename;
              document.body.appendChild(link);
              link.click();
              link.remove();
              window.URL.revokeObjectURL(url);
            })
            .catch(() => toast.error('Gagal mengunduh sertifikat. Coba lagi.'));
        });
      return;
    }

    // Tidak ada file_url sama sekali — coba via API
    api.get(`/certificates/${cert.id}/download`, { responseType: 'blob' })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => toast.error('Gagal mengunduh sertifikat. Coba lagi.'));
  };

  const getCertStatus = (milestone: number) => certs.find(c => c.milestone === milestone);

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Penghargaan Donor</h1>
        <p className="text-sm text-gray-500 mt-1">Pencapaian dan sertifikat donor darah Anda</p>
      </div>

      {/* Overall Progress Banner */}
      <div className="pmi-gradient rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <Trophy size={32} />
          </div>
          <div>
            <div className="text-3xl font-bold">{totalDonor}x</div>
            <div className="text-red-100 text-sm">Total Donor Berhasil</div>
            {stats?.next_milestone && (
              <div className="text-red-200 text-xs mt-1">
                {stats.next_milestone - totalDonor}x lagi menuju milestone {stats.next_milestone}
              </div>
            )}
          </div>
        </div>
        {stats?.next_milestone && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-red-100 mb-1">
              <span>Progress ke {stats.next_milestone}x</span>
              <span>{Math.round(stats.progress_to_next || 0)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(stats.progress_to_next || 0, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Milestone Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {milestones.map((milestone) => {
          const cert = getCertStatus(milestone);
          const achieved = totalDonor >= milestone;

          return (
            <div key={milestone}
              className={`bg-white rounded-2xl p-5 shadow-sm border-2 transition-all ${
                achieved && !cert ? 'border-red-200 shadow-red-50'
                : cert?.status === 'disetujui' ? 'border-green-200 shadow-green-50'
                : cert?.status === 'pending' ? 'border-amber-200'
                : 'border-gray-100 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  cert?.status === 'disetujui' ? 'bg-green-100'
                  : achieved ? 'bg-red-100'
                  : 'bg-gray-100'
                }`}>
                  <Award size={22} className={
                    cert?.status === 'disetujui' ? 'text-green-600'
                    : achieved ? 'text-red-600'
                    : 'text-gray-400'
                  } />
                </div>
                {cert && <StatusBadge status={cert.status} />}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{milestone}x</div>
              <div className="text-sm text-gray-500 mb-3">Donor</div>

              {cert?.status === 'disetujui' && cert.can_download && (
                <button
                  onClick={() => handleDownload(cert, milestone)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  <Download size={14} />
                  Unduh Sertifikat
                </button>
              )}
              {cert?.status === 'disetujui' && !cert.can_download && (
                <div className="flex items-center gap-2 text-amber-600 text-sm">
                  <Clock size={14} />
                  Sertifikat sedang disiapkan...
                </div>
              )}
              {cert?.status === 'pending' && (
                <div className="flex items-center gap-2 text-amber-600 text-sm">
                  <Clock size={14} />
                  Menunggu verifikasi petugas
                </div>
              )}
              {cert?.status === 'ditolak' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <XCircle size={14} />
                    Pengajuan ditolak
                  </div>
                  <button
                    onClick={() => {
                      setRequesting(milestone);
                      requestMutation.mutate(milestone);
                    }}
                    disabled={requesting === milestone}
                    className="w-full py-2 border border-red-200 text-red-600 rounded-xl text-xs font-medium hover:bg-red-50 transition-colors disabled:opacity-60"
                  >
                    {requesting === milestone ? 'Mengajukan...' : 'Ajukan Ulang'}
                  </button>
                </div>
              )}
              {!cert && achieved && (
                <button
                  onClick={() => {
                    setRequesting(milestone);
                    requestMutation.mutate(milestone);
                  }}
                  disabled={requesting === milestone}
                  className="w-full py-2 pmi-gradient text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {requesting === milestone ? 'Mengajukan...' : 'Ajukan Sertifikat'}
                </button>
              )}
              {!cert && !achieved && (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <span>{milestone - totalDonor}x donor lagi</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   PETUGAS/ADMIN VIEW – verification dashboard
───────────────────────────────────────────── */
const VerifikasiPenghargaan = () => {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('pending');
  const [page, setPage] = useState(1);
  const [actionTarget, setActionTarget] = useState<{ id: number; action: 'approve' | 'reject'; name: string; milestone: number } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['certificates-admin', statusFilter, page],
    queryFn: () => certificateService.getAll({ page }),
  });

  const actionMutation = useMutation({
    mutationFn: ({ id, action }: { id: number; action: 'approve' | 'reject' }) =>
      action === 'approve' ? certificateService.approve(id) : certificateService.reject(id),
    onSuccess: (_, { action }) => {
      toast.success(action === 'approve' ? 'Sertifikat berhasil disetujui!' : 'Pengajuan berhasil ditolak.');
      setActionTarget(null);
      qc.invalidateQueries({ queryKey: ['certificates-admin'] });
    },
    onError: () => toast.error('Terjadi kesalahan. Coba lagi.'),
  });

  const allCerts = data?.data?.data || [];

  // Client-side filter by status
  const certs = statusFilter
    ? allCerts.filter((c: any) => c.status === statusFilter)
    : allCerts;

  const stats = {
    pending: allCerts.filter((c: any) => c.status === 'pending').length,
    disetujui: allCerts.filter((c: any) => c.status === 'disetujui').length,
    ditolak: allCerts.filter((c: any) => c.status === 'ditolak').length,
  };

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Verifikasi Penghargaan</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tinjau dan verifikasi pengajuan sertifikat dari pendonor
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400 text-black"
          >
            <option value="">Semua Status</option>
            <option value="pending">Menunggu Verifikasi</option>
            <option value="disetujui">Disetujui</option>
            <option value="ditolak">Ditolak</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => setStatusFilter('pending')}
          className={`rounded-2xl p-4 border-2 text-left transition-all ${
            statusFilter === 'pending'
              ? 'border-amber-400 bg-amber-50'
              : 'border-gray-100 bg-white hover:border-amber-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Clock size={16} className="text-amber-600" />
            <span className="text-xs font-medium text-gray-500">Menunggu</span>
          </div>
          <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
        </button>
        <button
          onClick={() => setStatusFilter('disetujui')}
          className={`rounded-2xl p-4 border-2 text-left transition-all ${
            statusFilter === 'disetujui'
              ? 'border-green-400 bg-green-50'
              : 'border-gray-100 bg-white hover:border-green-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={16} className="text-green-600" />
            <span className="text-xs font-medium text-gray-500">Disetujui</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.disetujui}</div>
        </button>
        <button
          onClick={() => setStatusFilter('ditolak')}
          className={`rounded-2xl p-4 border-2 text-left transition-all ${
            statusFilter === 'ditolak'
              ? 'border-red-400 bg-red-50'
              : 'border-gray-100 bg-white hover:border-red-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <XCircle size={16} className="text-red-500" />
            <span className="text-xs font-medium text-gray-500">Ditolak</span>
          </div>
          <div className="text-2xl font-bold text-red-500">{stats.ditolak}</div>
        </button>
      </div>

      {/* Certificate List */}
      {certs.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="Tidak ada pengajuan"
          description={
            statusFilter === 'pending'
              ? 'Belum ada pengajuan sertifikat yang menunggu verifikasi.'
              : 'Tidak ada data untuk filter yang dipilih.'
          }
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {statusFilter === 'pending' && stats.pending > 0 && (
            <div className="px-6 py-3 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
              <AlertCircle size={14} className="text-amber-600" />
              <span className="text-xs font-medium text-amber-700">
                {stats.pending} pengajuan menunggu verifikasi Anda
              </span>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pendonor</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Milestone</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal Pengajuan</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {certs.map((cert: any) => (
                  <tr key={cert.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-red-700 font-bold text-sm">
                            {cert.user?.name?.charAt(0).toUpperCase() || '?'}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-800">{cert.user?.name || '—'}</div>
                          <div className="text-xs text-gray-400">{cert.user?.email || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                          <Award size={16} className="text-amber-600" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{cert.milestone}x Donor</div>
                          <div className="text-xs text-gray-400">Milestone</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{cert.created_at || '—'}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={cert.status} />
                    </td>
                    <td className="px-6 py-4">
                      {cert.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setActionTarget({
                              id: cert.id,
                              action: 'approve',
                              name: cert.user?.name || 'Pendonor',
                              milestone: cert.milestone,
                            })}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors"
                          >
                            <CheckCircle size={12} />
                            Setujui
                          </button>
                          <button
                            onClick={() => setActionTarget({
                              id: cert.id,
                              action: 'reject',
                              name: cert.user?.name || 'Pendonor',
                              milestone: cert.milestone,
                            })}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
                          >
                            <XCircle size={12} />
                            Tolak
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {actionTarget && (
        <ConfirmDialog
          isOpen={true}
          title={actionTarget.action === 'approve' ? 'Setujui Sertifikat?' : 'Tolak Pengajuan?'}
          description={
            actionTarget.action === 'approve'
              ? `Setujui pengajuan sertifikat ${actionTarget.milestone}x dari ${actionTarget.name}? Pendonor akan dapat mengunduh sertifikat.`
              : `Tolak pengajuan sertifikat ${actionTarget.milestone}x dari ${actionTarget.name}? Pendonor dapat mengajukan ulang.`
          }
          confirmText={actionTarget.action === 'approve' ? 'Ya, Setujui' : 'Ya, Tolak'}
          variant={actionTarget.action === 'approve' ? 'warning' : 'danger'}
          onConfirm={() => actionMutation.mutate({ id: actionTarget.id, action: actionTarget.action })}
          onCancel={() => setActionTarget(null)}
          isLoading={actionMutation.isPending}
        />
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN EXPORT – role-aware router
───────────────────────────────────────────── */
export const PenghargaanPage = () => {
  const { user } = useAuthStore();

  if (user?.role === 'pendonor') {
    return <PendonorPenghargaan />;
  }

  // petugas and admin see the verification dashboard
  return <VerifikasiPenghargaan />;
};
