import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Award, Download, CheckCircle, Clock, XCircle, Trophy } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import certificateService from '../../services/certificateService';
import donorService from '../../services/donorService';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { PageSkeleton } from '../../components/ui/LoadingSkeleton';
import toast from 'react-hot-toast';

const milestones = [10, 25, 50, 75, 100];

export const PenghargaanPage = () => {
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const [requesting, setRequesting] = useState<number | null>(null);

  const { data: statsData } = useQuery({
    queryKey: ['donor-stats'],
    queryFn: () => donorService.getStats(),
  });

  const { data: certData, isLoading } = useQuery({
    queryKey: ['certificates'],
    queryFn: () => certificateService.getAll(),
  });

  const requestMutation = useMutation({
    mutationFn: (milestone: number) => certificateService.request(milestone),
    onSuccess: () => {
      toast.success('Pengajuan sertifikat berhasil dikirim!');
      setRequesting(null);
      qc.invalidateQueries({ queryKey: ['certificates'] });
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

  const getCertStatus = (milestone: number) => {
    return certs.find(c => c.milestone === milestone);
  };

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Penghargaan Donor</h1>
        <p className="text-sm text-gray-500 mt-1">Pencapaian dan sertifikat donor darah Anda</p>
      </div>

      {/* Overall Progress */}
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

      {/* Milestones */}
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
                  <Award size={22} className={cert?.status === 'disetujui' ? 'text-green-600' : achieved ? 'text-red-600' : 'text-gray-400'} />
                </div>
                {cert && <StatusBadge status={cert.status} />}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{milestone}x</div>
              <div className="text-sm text-gray-500 mb-3">Donor</div>

              {cert?.status === 'disetujui' && cert.can_download && (
                <a
                  href={`/api/certificates/${cert.id}/download`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  <Download size={14} />
                  Unduh Sertifikat
                </a>
              )}
              {cert?.status === 'pending' && (
                <div className="flex items-center gap-2 text-amber-600 text-sm">
                  <Clock size={14} />
                  Menunggu verifikasi
                </div>
              )}
              {cert?.status === 'ditolak' && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <XCircle size={14} />
                  Pengajuan ditolak
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
