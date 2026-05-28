import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, BookOpen, Eye, EyeOff } from 'lucide-react';
import articleService from '../../services/articleService';
import { PageSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Pagination } from '../../components/ui/Pagination';
import toast from 'react-hot-toast';
import type { Article } from '../../types';

export const KelolaArtikelPage = () => {
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Article | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [form, setForm] = useState({ title: '', content: '', publish: false });
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['articles-admin', page],
    queryFn: () => articleService.getAll({ page }),
  });

  const createMutation = useMutation({
    mutationFn: () => articleService.create(form),
    onSuccess: () => {
      toast.success('Artikel berhasil dibuat!');
      resetForm();
      qc.invalidateQueries({ queryKey: ['articles-admin'] });
      qc.invalidateQueries({ queryKey: ['articles'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Gagal membuat artikel.'),
  });

  const updateMutation = useMutation({
    mutationFn: () => articleService.update(editTarget!.id, form),
    onSuccess: () => {
      toast.success('Artikel berhasil diperbarui!');
      resetForm();
      qc.invalidateQueries({ queryKey: ['articles-admin'] });
      qc.invalidateQueries({ queryKey: ['articles'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Gagal memperbarui artikel.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => articleService.delete(id),
    onSuccess: () => {
      toast.success('Artikel berhasil dihapus.');
      setDeleteTarget(null);
      qc.invalidateQueries({ queryKey: ['articles-admin'] });
      qc.invalidateQueries({ queryKey: ['articles'] });
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setEditTarget(null);
    setForm({ title: '', content: '', publish: false });
  };

  const openEdit = (article: Article) => {
    setEditTarget(article);
    setForm({ title: article.title, content: article.content, publish: article.is_published });
    setShowForm(true);
  };

  const articles = data?.data?.data || [];
  const meta = data?.data?.meta;

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Artikel</h1>
          <p className="text-sm text-gray-500 mt-1">Buat dan kelola konten edukasi donor darah</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 pmi-gradient text-white rounded-xl text-sm font-medium hover:opacity-90 shadow-sm"
        >
          <Plus size={16} />
          Tulis Artikel
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in">
          <h3 className="font-bold text-gray-900 mb-4">{editTarget ? 'Edit Artikel' : 'Tulis Artikel Baru'}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul Artikel *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Masukkan judul artikel yang menarik..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Isi Artikel * <span className="text-gray-400 font-normal">(mendukung HTML)</span>
              </label>
              <textarea
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })}
                rows={12}
                placeholder="<p>Tulis konten artikel di sini...</p>&#10;<h2>Sub Judul</h2>&#10;<ul><li>Poin 1</li></ul>"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400 resize-y font-mono bg-gray-50"
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`relative w-10 h-5 rounded-full transition-colors ${form.publish ? 'bg-red-600' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.publish ? 'translate-x-5' : 'translate-x-0.5'}`} />
                <input
                  type="checkbox"
                  checked={form.publish}
                  onChange={e => setForm({ ...form, publish: e.target.checked })}
                  className="sr-only"
                />
              </div>
              <span className="text-sm text-gray-700 font-medium">
                {form.publish ? 'Publikasikan sekarang' : 'Simpan sebagai draft'}
              </span>
            </label>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={resetForm}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
              Batal
            </button>
            <button
              onClick={() => editTarget ? updateMutation.mutate() : createMutation.mutate()}
              disabled={!form.title || !form.content || createMutation.isPending || updateMutation.isPending}
              className="flex-1 py-2.5 pmi-gradient text-white rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-60">
              {createMutation.isPending || updateMutation.isPending
                ? 'Menyimpan...'
                : editTarget ? 'Perbarui Artikel' : form.publish ? 'Publikasikan' : 'Simpan Draft'}
            </button>
          </div>
        </div>
      )}

      {articles.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Belum ada artikel"
          description="Mulai tulis artikel edukasi donor darah untuk pendonor."
        />
      ) : (
        <div className="space-y-3">
          {articles.map(article => (
            <div key={article.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between gap-4 card-hover">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${article.is_published ? 'bg-green-500' : 'bg-gray-300'}`} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 text-sm truncate">{article.title}</h3>
                  <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                    <span>{article.is_published ? `✓ Dipublikasikan ${article.published_at}` : '◦ Draft'}</span>
                    <span>·</span>
                    <span>oleh {article.author?.name}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <div className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  article.is_published
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {article.is_published ? <><Eye size={11} className="inline mr-1" />Publik</> : <><EyeOff size={11} className="inline mr-1" />Draft</>}
                </div>
                <button onClick={() => openEdit(article)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                  <Edit size={15} />
                </button>
                <button onClick={() => setDeleteTarget(article.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {meta && <Pagination currentPage={meta.current_page} lastPage={meta.last_page} onPageChange={setPage} />}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Artikel?"
        description="Artikel yang dihapus tidak dapat dikembalikan. Pastikan ini benar sebelum melanjutkan."
        confirmText="Ya, Hapus Artikel"
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
