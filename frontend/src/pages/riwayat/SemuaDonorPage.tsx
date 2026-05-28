import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Heart, Clock, Search } from 'lucide-react';
import donorService from '../../services/donorService';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { BloodTypeBadge } from '../../components/ui/BloodTypeBadge';
import { PageSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Pagination } from '../../components/ui/Pagination';

export const SemuaDonorPage = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['all-donors-admin', page],
    queryFn: () => donorService.getAll({ page }),
  });

  const donors = data?.data?.data || [];
  const meta = data?.data?.meta;

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Semua Donor</h1>
          <p className="text-sm text-gray-500 mt-1">
            Riwayat donor darah seluruh pendonor
            {meta && <span className="font-medium text-gray-700"> ({meta.total} total)</span>}
          </p>
        </div>
      </div>

      {donors.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Belum ada data donor"
          description="Belum ada catatan donor darah dalam sistem."
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">No</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pendonor</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Gol. Darah</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal Donor</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kondisi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {donors.map((donor, i) => (
                  <tr key={donor.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {(page - 1) * 10 + i + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-red-700 font-bold text-xs">
                            {donor.user?.name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-sm text-gray-800">{donor.user?.name}</div>
                          <div className="text-xs text-gray-400">{donor.user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {donor.user?.blood_type
                        ? <BloodTypeBadge type={donor.user.blood_type} />
                        : <span className="text-xs text-gray-400">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Clock size={13} className="text-gray-400" />
                        {donor.donation_date_formatted}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={donor.donation_status} />
                    </td>
                    <td className="px-6 py-4">
                      {donor.condition ? (
                        <div className="space-y-1">
                          <div className="text-xs text-gray-500">
                            Hb: <span className="font-medium">{donor.condition.hemoglobin}</span> g/dL &nbsp;·&nbsp;
                            TD: <span className="font-medium">{donor.condition.blood_pressure}</span>
                          </div>
                          <StatusBadge status={donor.condition.eligibility_status} />
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
          {meta && (
            <div className="p-4 border-t border-gray-100">
              <Pagination currentPage={meta.current_page} lastPage={meta.last_page} onPageChange={setPage} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
