import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Droplets } from "lucide-react";
import stockService from "../../services/stockService";
import locationService from "../../services/locationService";
import { PageSkeleton } from "../../components/ui/LoadingSkeleton";
import { EmptyState } from "../../components/ui/EmptyState";
import { BloodTypeBadge } from "../../components/ui/BloodTypeBadge";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import toast from "react-hot-toast";
import type { Stock } from "../../types";

export const KelolaStokPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Stock | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [form, setForm] = useState({
    blood_type: "",
    amount: "",
    location_id: "",
  });
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["stocks-admin"],
    queryFn: () => stockService.getAll(),
  });

  const { data: locData } = useQuery({
    queryKey: ["locations"],
    queryFn: () => locationService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      stockService.create({
        blood_type: form.blood_type,
        amount: Number(form.amount),
        location_id: Number(form.location_id),
      }),
    onSuccess: () => {
      toast.success("Stok berhasil ditambahkan!");
      resetForm();
      qc.invalidateQueries({ queryKey: ["stocks-admin"] });
      qc.invalidateQueries({ queryKey: ["stocks"] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Gagal menambahkan stok."),
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      stockService.update(editTarget!.id, {
        blood_type: form.blood_type,
        amount: Number(form.amount),
        location_id: Number(form.location_id),
      }),
    onSuccess: () => {
      toast.success("Stok berhasil diperbarui!");
      resetForm();
      qc.invalidateQueries({ queryKey: ["stocks-admin"] });
      qc.invalidateQueries({ queryKey: ["stocks"] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Gagal memperbarui stok."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => stockService.delete(id),
    onSuccess: () => {
      toast.success("Stok berhasil dihapus.");
      setDeleteTarget(null);
      qc.invalidateQueries({ queryKey: ["stocks-admin"] });
      qc.invalidateQueries({ queryKey: ["stocks"] });
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setEditTarget(null);
    setForm({ blood_type: "", amount: "", location_id: "" });
  };

  const openEdit = (stock: Stock) => {
    setEditTarget(stock);
    setForm({
      blood_type: stock.blood_type,
      amount: String(stock.amount),
      location_id: String(stock.location?.id || ""),
    });
    setShowForm(true);
  };

  const stocks = data?.data?.data || [];
  const locations = locData?.data?.data || [];

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Kelola Stok Darah
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manajemen ketersediaan stok darah di setiap lokasi
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 pmi-gradient text-white rounded-xl text-sm font-medium hover:opacity-90 shadow-sm"
        >
          <Plus size={16} />
          Tambah Stok
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in">
          <h3 className="font-bold text-gray-900 mb-4">
            {editTarget ? "Edit Stok" : "Tambah Stok Baru"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Golongan Darah *
              </label>
              <select
                value={form.blood_type}
                onChange={(e) =>
                  setForm({ ...form, blood_type: e.target.value })
                }
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400"
              >
                <option value="">Pilih golongan</option>
                {["A", "B", "AB", "O"].map((t) => (
                  <option key={t} value={t}>
                    Golongan {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Jumlah (kantong) *
              </label>
              <input
                type="number"
                min="0"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Lokasi *
              </label>
              <select
                value={form.location_id}
                onChange={(e) =>
                  setForm({ ...form, location_id: e.target.value })
                }
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400"
              >
                <option value="">Pilih lokasi</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={resetForm}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={() =>
                editTarget ? updateMutation.mutate() : createMutation.mutate()
              }
              disabled={
                !form.blood_type ||
                !form.amount ||
                !form.location_id ||
                createMutation.isPending ||
                updateMutation.isPending
              }
              className="flex-1 py-2.5 pmi-gradient text-white rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-60"
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Menyimpan..."
                : editTarget
                  ? "Perbarui Stok"
                  : "Simpan Stok"}
            </button>
          </div>
        </div>
      )}

      {stocks.length === 0 ? (
        <EmptyState
          icon={Droplets}
          title="Belum ada data stok"
          description="Tambahkan data stok darah untuk setiap lokasi PMI."
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Golongan
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Lokasi
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Jumlah
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Terakhir Update
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stocks.map((stock) => (
                  <tr
                    key={stock.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <BloodTypeBadge type={stock.blood_type} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-800">
                        {stock.location?.name}
                      </div>
                      <div className="text-xs text-gray-400 capitalize">
                        {stock.location?.type?.replace("_", " ")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-gray-900">
                        {stock.amount}
                      </span>
                      <span className="text-xs text-gray-400 ml-1">
                        kantong
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                          stock.status_color === "green"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : stock.status_color === "yellow"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {stock.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {stock.updated_at}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(stock)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(stock.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Data Stok?"
        description="Data stok darah yang dihapus tidak dapat dikembalikan."
        confirmText="Ya, Hapus"
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
