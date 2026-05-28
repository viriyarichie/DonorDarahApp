import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Droplets, RefreshCw, MapPin, Filter } from 'lucide-react';
import stockService from '../../services/stockService';
import locationService from '../../services/locationService';
import { BloodTypeBadge } from '../../components/ui/BloodTypeBadge';
import { PageSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';

export const StokDarahPage = () => {
  const [locationFilter, setLocationFilter] = useState('');
  const [bloodTypeFilter, setBloodTypeFilter] = useState('');

  const { data: locData } = useQuery({
    queryKey: ['locations'],
    queryFn: () => locationService.getAll(),
  });

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['stocks', locationFilter, bloodTypeFilter],
    queryFn: () => stockService.getAll({
      location_id: locationFilter ? Number(locationFilter) : undefined,
      blood_type: bloodTypeFilter || undefined,
    }),
  });

  const stocks = data?.data?.data || [];
  const summary = data?.data?.summary;
  const locations = locData?.data?.data || [];

  const statusConfig = {
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', label: 'Aman' },
    yellow: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', label: 'Perlu Perhatian' },
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', label: 'Kritis' },
  };

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stok Darah</h1>
          <p className="text-sm text-gray-500 mt-1">Informasi ketersediaan darah di seluruh lokasi PMI</p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60"
        >
          <RefreshCw size={15} className={isFetching ? 'animate-spin' : ''} />
          Perbarui
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(summary).map(([type, info]) => {
            const color = info.status === 'aman' ? 'green' : info.status === 'perlu_perhatian' ? 'yellow' : 'red';
            const cfg = statusConfig[color];
            return (
              <div key={type} className={`${cfg.bg} ${cfg.border} border rounded-2xl p-5`}>
                <div className="flex items-center justify-between mb-3">
                  <BloodTypeBadge type={type} size="lg" />
                  <Droplets className={cfg.text} size={20} />
                </div>
                <div className="text-3xl font-bold text-gray-900">{info.total}</div>
                <div className="text-xs text-gray-500 mt-1">kantong</div>
                <div className={`text-xs font-medium ${cfg.text} mt-2`}>{cfg.label}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Filter size={16} className="text-gray-400" />
          <select
            value={locationFilter}
            onChange={e => setLocationFilter(e.target.value)}
            className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400"
          >
            <option value="">Semua Lokasi</option>
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
        </div>
        <select
          value={bloodTypeFilter}
          onChange={e => setBloodTypeFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400"
        >
          <option value="">Semua Golongan</option>
          {['A', 'B', 'AB', 'O'].map(t => <option key={t} value={t}>Golongan {t}</option>)}
        </select>
      </div>

      {/* Stock Table */}
      {stocks.length === 0 ? (
        <EmptyState
          icon={Droplets}
          title="Tidak ada data stok"
          description="Belum ada data stok darah untuk filter yang dipilih."
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Golongan</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lokasi</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipe</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Jumlah</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Diperbarui</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stocks.map((stock) => {
                  const color = stock.status_color || 'green';
                  const cfg = statusConfig[color as keyof typeof statusConfig] || statusConfig.green;
                  return (
                    <tr key={stock.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <BloodTypeBadge type={stock.blood_type} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-gray-400" />
                          <span className="text-sm font-medium text-gray-800">{stock.location?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">{stock.location?.type}</td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-bold text-gray-900">{stock.amount}</span>
                        <span className="text-xs text-gray-400 ml-1">kantong</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.border} ${cfg.text}`}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">{stock.updated_at}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
