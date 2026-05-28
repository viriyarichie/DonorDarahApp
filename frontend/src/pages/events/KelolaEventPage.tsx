import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, MapPin, Calendar, Users } from 'lucide-react';
import eventService from '../../services/eventService';
import locationService from '../../services/locationService';
import { PageSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Pagination } from '../../components/ui/Pagination';
import toast from 'react-hot-toast';
import type { Event } from '../../types';

export const KelolaEventPage = () => {
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Event | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', description: '', event_date: '', quota: '50', location_id: '' });
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['events-admin', page],
    queryFn: () => eventService.getAll({ page }),
  });

  const { data: locData } = useQuery({
    queryKey: ['locations'],
    queryFn: () => locationService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: () => eventService.create({
      name: form.name, description: form.description,
      event_date: form.event_date, quota: Number(form.quota),
      location_id: Number(form.location_id),
    }),
    onSuccess: () => {
      toast.success('Event berhasil dibuat!');
      resetForm();
      qc.invalidateQueries({ queryKey: ['events-admin'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Gagal membuat event.'),
  });

  const updateMutation = useMutation({
    mutationFn: () => eventService.update(editTarget!.id, {
      name: form.name, description: form.description,
      event_date: form.event_date, quota: Number(form.quota),
      location_id: Number(form.location_id),
    }),
    onSuccess: () => {
      toast.success('Event berhasil diperbarui!');
      resetForm();
      qc.invalidateQueries({ queryKey: ['events-admin'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Gagal memperbarui event.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => eventService.delete(id),
    onSuccess: () => {
      toast.success('Event berhasil dihapus.');
      setDeleteTarget(null);
      qc.invalidateQueries({ queryKey: ['events-admin'] });
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setEditTarget(null);
    setForm({ name: '', description: '', event_date: '', quota: '50', location_id: '' });
  };

  const openEdit = (event: Event) => {
    setEditTarget(event);
    setForm({
      name: event.name,
      description: event.description,
      event_date: event.event_date?.split('T')[0] || '',
      quota: String(event.quota),
      location_id: String(event.location?.id || ''),
    });
    setShowForm(true);
  };

  const events = data?.data?.data || [];
  const meta = data?.data?.meta;
  const locations = locData?.data?.data || [];

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Event</h1>
          <p className="text-sm text-gray-500 mt-1">Buat dan kelola event donor darah PMI</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 pmi-gradient text-white rounded-xl text-sm font-medium hover:opacity-90 shadow-sm"
        >
          <Plus size={16} />
          Tambah Event
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in">
          <h3 className="font-bold text-gray-900 mb-4">{editTarget ? 'Edit Event' : 'Tambah Event Baru'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Event *</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Nama kegiatan donor darah"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi *</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3} placeholder="Deskripsi event..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal & Jam *</label>
              <input type="datetime-local" value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Kuota Peserta</label>
              <input type="number" value={form.quota} onChange={e => setForm({ ...form, quota: e.target.value })}
                min="1" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Lokasi *</label>
              <select value={form.location_id} onChange={e => setForm({ ...form, location_id: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400">
                <option value="">Pilih lokasi...</option>
                {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={resetForm}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">Batal</button>
            <button
              onClick={() => editTarget ? updateMutation.mutate() : createMutation.mutate()}
              disabled={!form.name || !form.event_date || !form.location_id || createMutation.isPending || updateMutation.isPending}
              className="flex-1 py-2.5 pmi-gradient text-white rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-60">
              {createMutation.isPending || updateMutation.isPending ? 'Menyimpan...' : editTarget ? 'Perbarui Event' : 'Buat Event'}
            </button>
          </div>
        </div>
      )}

      {events.length === 0 ? (
        <EmptyState icon={MapPin} title="Belum ada event" description="Belum ada event yang dibuat. Klik tombol Tambah Event untuk memulai." />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Peserta</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {events.map(event => (
                  <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-sm text-gray-800">{event.name}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={11} />{event.location?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Calendar size={13} className="text-gray-400" />
                        {event.event_date_formatted}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Users size={13} className="text-gray-400" />
                        {event.registered_count}/{event.quota}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(event)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                          <Edit size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget(event.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {meta && <div className="p-4 border-t border-gray-100"><Pagination currentPage={meta.current_page} lastPage={meta.last_page} onPageChange={setPage} /></div>}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Event?"
        description="Event yang dihapus beserta seluruh pendaftarannya tidak dapat dikembalikan."
        confirmText="Ya, Hapus"
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
