import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
} from "lucide-react";
import bookingService from "../../services/bookingService";
import locationService from "../../services/locationService";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { PageSkeleton } from "../../components/ui/LoadingSkeleton";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { Pagination } from "../../components/ui/Pagination";
import { EmptyState } from "../../components/ui/EmptyState";
import toast from "react-hot-toast";

export const BookingPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [cancelTarget, setCancelTarget] = useState<number | null>(null);
  const [form, setForm] = useState({
    location_id: "",
    booking_date: "",
    notes: "",
  });
  const qc = useQueryClient();

  const { data: locData } = useQuery({
    queryKey: ["locations"],
    queryFn: () => locationService.getAll(),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["bookings", page],
    queryFn: () => bookingService.getAll({ page }),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      bookingService.create({
        location_id: Number(form.location_id),
        booking_date: form.booking_date,
        notes: form.notes,
      }),
    onSuccess: () => {
      toast.success("Booking donor berhasil dibuat!");
      setShowForm(false);
      setForm({ location_id: "", booking_date: "", notes: "" });
      qc.invalidateQueries({ queryKey: ["bookings"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (err: any) => {
      const msg =
        err.response?.data?.errors?.booking_date?.[0] ||
        err.response?.data?.message ||
        "Gagal membuat booking.";
      toast.error(msg);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => bookingService.cancel(id),
    onSuccess: () => {
      toast.success("Booking berhasil dibatalkan.");
      setCancelTarget(null);
      qc.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: () => toast.error("Gagal membatalkan booking."),
  });

  const bookings = data?.data?.data || [];
  const meta = data?.data?.meta;
  const locations = locData?.data?.data || [];

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jadwal Donor</h1>
          <p className="text-sm text-gray-500 mt-1">
            Buat dan pantau jadwal donor darah Anda
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 pmi-gradient text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus size={16} />
          Buat Booking
        </button>
      </div>

      {/* Booking Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in">
          <h3 className="font-bold text-gray-900 mb-4">
            Buat Jadwal Donor Baru
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Pilih Lokasi *
              </label>
              <select
                value={form.location_id}
                onChange={(e) =>
                  setForm({ ...form, location_id: e.target.value })
                }
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400 text-black"
                required
              >
                <option value="">Pilih lokasi donor...</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tanggal Donor *
              </label>
              <input
                type="date"
                value={form.booking_date}
                onChange={(e) =>
                  setForm({ ...form, booking_date: e.target.value })
                }
                min={minDateStr}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400 text-black"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Catatan (opsional)
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                placeholder="Informasi tambahan..."
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400 resize-none text-black"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={() => createMutation.mutate()}
              disabled={
                !form.location_id ||
                !form.booking_date ||
                createMutation.isPending
              }
              className="flex-1 py-2.5 pmi-gradient text-white rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-60"
            >
              {createMutation.isPending ? "Memproses..." : "Konfirmasi Booking"}
            </button>
          </div>
        </div>
      )}

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="Belum ada booking"
          description="Anda belum memiliki jadwal donor. Buat jadwal donor pertama Anda!"
          action={
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2.5 pmi-gradient text-white rounded-xl text-sm font-medium"
            >
              Buat Booking Sekarang
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 card-hover"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="text-red-600" size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">
                      {booking.location?.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {booking.location?.address}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock size={13} className="text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {booking.booking_date_formatted}
                      </span>
                      <StatusBadge status={booking.status} />
                    </div>
                  </div>
                </div>
                {(booking.status === "menunggu" ||
                  booking.status === "dikonfirmasi") && (
                  <button
                    onClick={() => setCancelTarget(booking.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
                  >
                    <XCircle size={14} />
                    Batalkan
                  </button>
                )}
              </div>
            </div>
          ))}
          {meta && (
            <Pagination
              currentPage={meta.current_page}
              lastPage={meta.last_page}
              onPageChange={setPage}
            />
          )}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!cancelTarget}
        title="Batalkan Booking?"
        description="Apakah Anda yakin ingin membatalkan jadwal donor ini?"
        confirmText="Ya, Batalkan"
        onConfirm={() => cancelTarget && cancelMutation.mutate(cancelTarget)}
        onCancel={() => setCancelTarget(null)}
        isLoading={cancelMutation.isPending}
      />
    </div>
  );
};
