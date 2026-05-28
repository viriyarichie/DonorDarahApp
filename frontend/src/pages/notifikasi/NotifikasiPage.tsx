import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, BellOff, Check, CheckCheck } from 'lucide-react';
import notificationService from '../../services/notificationService';
import { PageSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Pagination } from '../../components/ui/Pagination';
import { useState } from 'react';
import toast from 'react-hot-toast';

const typeColors: Record<string, string> = {
  reminder: 'bg-amber-100 text-amber-700',
  penghargaan: 'bg-purple-100 text-purple-700',
  event: 'bg-blue-100 text-blue-700',
  umum: 'bg-gray-100 text-gray-700',
};

const typeLabels: Record<string, string> = {
  reminder: 'Pengingat',
  penghargaan: 'Penghargaan',
  event: 'Event',
  umum: 'Umum',
};

export const NotifikasiPage = () => {
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications', page],
    queryFn: () => notificationService.getAll({ page }),
  });

  const readMutation = useMutation({
    mutationFn: (id: number) => notificationService.markAsRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const readAllMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      toast.success('Semua notifikasi telah dibaca.');
      qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const notifications = data?.data?.data || [];
  const unreadCount = data?.data?.unread_count || 0;
  const meta = data?.data?.meta;

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifikasi</h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : 'Semua sudah dibaca'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => readAllMutation.mutate()}
            disabled={readAllMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <CheckCheck size={15} />
            Tandai Semua Dibaca
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={BellOff}
          title="Tidak ada notifikasi"
          description="Anda belum memiliki notifikasi apapun."
        />
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${
                notif.is_read ? 'border-gray-100 opacity-70' : 'border-red-100 shadow-red-50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {!notif.is_read && (
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  )}
                  <div className={notif.is_read ? 'ml-5' : ''}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        typeColors[notif.type] || typeColors.umum
                      }`}>
                        {typeLabels[notif.type] || 'Umum'}
                      </span>
                      <span className="text-xs text-gray-400">{notif.created_at_diff}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{notif.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{notif.message}</p>
                  </div>
                </div>
                {!notif.is_read && (
                  <button
                    onClick={() => readMutation.mutate(notif.id)}
                    className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                    title="Tandai sudah dibaca"
                  >
                    <Check size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
          {meta && <Pagination currentPage={meta.current_page} lastPage={meta.last_page} onPageChange={setPage} />}
        </div>
      )}
    </div>
  );
};
