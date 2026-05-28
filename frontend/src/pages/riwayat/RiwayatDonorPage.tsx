import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock, Heart, Calendar, CheckCircle } from 'lucide-react';
import donorService from '../../services/donorService';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { PageSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Pagination } from '../../components/ui/Pagination';
import { StatsCard } from '../../components/ui/StatsCard';

export const RiwayatDonorPage = () => {
  const [page, setPage] = useState(1);

  const { data: statsData } = useQuery({
    queryKey: ['donor-stats'],
    queryFn: () => donorService.getStats(),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['donors-riwayat', page],
    queryFn: () => donorService.getAll({ page }),
  });

  const stats = statsData?.data?.data;
  const donors = data?.data?.data || [];
  const meta = data?.data?.meta;

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Riwayat Donor</h1>
        <p className="text-sm text-gray-500 mt-1">Rekam jejak donor darah Anda</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Total Donor Berhasil"
          value={stats?.total_donor || 0}
          icon={Heart}
          color="red"
          subtitle="Kali berhasil donor"
        />
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Calendar className="text-green-600" size={18} />
            </div>
            <span className="text-sm font-medium text-gray-600">Donor Terakhir</span>
          </div>
          <div className="text-xl font-bold text-gray-900">
            {stats?.last_donation_date
              ? new Date(stats.last_donation_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
              : 'Belum ada'}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="text-blue-600" size={18} />
            </div>
            <span className="text-sm font-medium text-gray-600">Bisa Donor Lagi</span>
          </div>
          <div className="text-xl font-bold text-gray-900">
            {stats?.next_eligible_date
              ? new Date(stats.next_eligible_date) <= new Date()
                ? '✓ Sekarang'
                : new Date(stats.next_eligible_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
              : 'Kapan saja'}
          </div>
        </div>
      </div>

      {/* History list */}
      {donors.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="Belum ada riwayat donor"
          description="Riwayat donor darah Anda akan muncul di sini setelah menyelesaikan proses donor."
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Riwayat Lengkap</h3>
            <span className="text-sm text-gray-500">{meta?.total || donors.length} record</span>
          </div>
          <div className="divide-y divide-gray-50">
            {donors.map((donor, i) => (
              <div key={donor.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-700 text-xs font-bold">
                    #{(page - 1) * 10 + i + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
                      <Clock size={13} className="text-gray-400" />
                      {donor.donation_date_formatted}
                    </div>
                    <StatusBadge status={donor.donation_status} />
                  </div>
                  {donor.condition && (
                    <div className="text-xs text-gray-400 mt-1">
                      Hemoglobin: {donor.condition.hemoglobin} g/dL &nbsp;·&nbsp;
                      Tekanan Darah: {donor.condition.blood_pressure} mmHg
                      &nbsp;·&nbsp;
                      <StatusBadge status={donor.condition.eligibility_status} />
                    </div>
                  )}
                  {donor.condition?.notes && (
                    <div className="text-xs text-gray-400 mt-1 italic">Catatan: {donor.condition.notes}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {meta && (
            <div className="px-6 py-4 border-t border-gray-100">
              <Pagination currentPage={meta.current_page} lastPage={meta.last_page} onPageChange={setPage} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
