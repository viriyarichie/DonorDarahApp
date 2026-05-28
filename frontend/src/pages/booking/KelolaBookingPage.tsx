import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, CheckCircle, XCircle, Check } from 'lucide-react';
import bookingService from '../../services/bookingService';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { BloodTypeBadge } from '../../components/ui/BloodTypeBadge';
import { PageSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Pagination } from '../../components/ui/Pagination';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import toast from 'react-hot-toast';

export const KelolaBookingPage = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [actionTarget, setActionTarget] = useState<{ id: number; action: 'confirm' | 'complete' | 'cancel' } | null>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['bookings-admin', page, statusFilter],
    queryFn: () => bookingService.getAll({ status: statusFilter || undefined, page }),
  });

  const actionMutation = useMutation({
    mutationFn: ({ id, action }: { id: number; action: string }) => {
      if (action === 'confirm') return bookingService.confirm(id);
      if (action === 'complete') return bookingService.complete(id);
      return bookingService.cancel(id);
    },
    onSuccess: (_, { action }) => {
      const messages: Record<string, string> = {
        confirm: 'Booking berhasil dikonfirmasi!',
        complete: 'Donor berhasil diselesaikan!',
        cancel: 'Booking berhasil dibatalkan.',
      };
      toast.success(messages[action]);
      setActionTarget(null);
      qc.invalidateQueries({ queryKey: ['bookings-admin'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Terjadi kesalahan.'),
  });

  const bookings = data?.data?.data || [];
  const meta = data?.data?.meta;

  const actionConfig = {
    confirm: {
      title: 'Konfirmasi Booking?',
      description: 'Booking akan dikonfirmasi. Pendonor akan dapat hadir pada tanggal yang ditentukan.',
      confirmText: 'Konfirmasi',
      variant: 'warning' as const,
    },
    complete: {
      title: 'Selesaikan Proses Donor?',
      description: 'Data donor akan dicatat dan booking ditandai sebagai selesai.',
      confirmText: 'Selesaikan',
      variant: 'warning' as const,
    },
    cancel: {
      title: 'Batalkan Booking?',
      description: 'Booking akan dibatalkan dan pendonor akan diberitahu.',
      confirmText: 'Batalkan',
      variant: 'danger' as const,
    },
  };

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Booking</h1>
          <p className="text-sm text-gray-500 mt-1">Konfirmasi dan kelola jadwal donor pendonor</p>
        </div>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400"
        >
          <option value="">Semua Status</option>
          <option value="menunggu">Menunggu</option>
          <option value="dikonfirmasi">Dikonfirmasi</option>
          <option value="selesai">Selesai</option>
          <option value="dibatalkan">Dibatalkan</option>
        </select>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="Tidak ada booking"
          description="Belum ada booking dengan filter yang dipilih."
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pendonor</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Gol. Darah</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal Donor</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lokasi</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-sm text-gray-800">{booking.user?.name}</div>
                      <div className="text-xs text-gray-400">{booking.user?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      {booking.user?.blood_type
                        ? <BloodTypeBadge type={booking.user.blood_type} />
                        : <span className="text-xs text-gray-400">—</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.booking_date_formatted}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 max-w-[180px] truncate">{booking.location?.name}</div>
                      <div className="text-xs text-gray-400 capitalize">{booking.location?.type?.replace('_', ' ')}</div>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={booking.status} /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        {booking.status === 'menunggu' && (
                          <button
                            onClick={() => setActionTarget({ id: booking.id, action: 'confirm' })}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Konfirmasi"
                          >
                            <CheckCircle size={15} />
                          </button>
                        )}
                        {booking.status === 'dikonfirmasi' && (
                          <button
                            onClick={() => setActionTarget({ id: booking.id, action: 'complete' })}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Selesaikan"
                          >
                            <Check size={15} />
                          </button>
                        )}
                        {(booking.status === 'menunggu' || booking.status === 'dikonfirmasi') && (
                          <button
                            onClick={() => setActionTarget({ id: booking.id, action: 'cancel' })}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Batalkan"
                          >
                            <XCircle size={15} />
                          </button>
                        )}
                        {(booking.status === 'selesai' || booking.status === 'dibatalkan') && (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </div>
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

      {actionTarget && (
        <ConfirmDialog
          isOpen={true}
          title={actionConfig[actionTarget.action].title}
          description={actionConfig[actionTarget.action].description}
          confirmText={actionConfig[actionTarget.action].confirmText}
          variant={actionConfig[actionTarget.action].variant}
          onConfirm={() => actionMutation.mutate(actionTarget)}
          onCancel={() => setActionTarget(null)}
          isLoading={actionMutation.isPending}
        />
      )}
    </div>
  );
};
