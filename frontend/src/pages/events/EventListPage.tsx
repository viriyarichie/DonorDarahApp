import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Users, ChevronRight, Filter } from "lucide-react";
import eventService from "../../services/eventService";
import { useAuthStore } from "../../stores/authStore";
import { PageSkeleton } from "../../components/ui/LoadingSkeleton";
import { EmptyState } from "../../components/ui/EmptyState";
import { Pagination } from "../../components/ui/Pagination";
import toast from "react-hot-toast";

export const EventListPage = () => {
  const [page, setPage] = useState(1);
  const [upcomingOnly, setUpcomingOnly] = useState(true);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuthStore();
  const isPendonor = user?.role === "pendonor";

  const { data, isLoading } = useQuery({
    queryKey: ["events", page, upcomingOnly],
    queryFn: () => eventService.getAll({ upcoming: upcomingOnly, page }),
  });

  const registerMutation = useMutation({
    mutationFn: (id: number) => eventService.register(id),
    onSuccess: () => {
      toast.success("Pendaftaran event berhasil!");
      qc.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.errors?.event_id?.[0] || "Gagal mendaftar event.",
      );
    },
  });

  const events = data?.data?.data || [];
  const meta = data?.data?.meta;

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Event Donor Darah
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Jadwal kegiatan donor darah PMI terdekat
          </p>
        </div>
        <button
          onClick={() => setUpcomingOnly(!upcomingOnly)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
            upcomingOnly
              ? "bg-red-600 text-white border-red-600"
              : "border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Filter size={14} />
          {upcomingOnly ? "Mendatang" : "Semua"}
        </button>
      </div>

      {events.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="Tidak ada event"
          description={
            upcomingOnly
              ? "Belum ada event donor darah yang akan datang."
              : "Belum ada event donor darah."
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event) => {
            const isFull = event.registered_count >= event.quota;
            return (
              <div
                key={event.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 card-hover flex flex-col"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-red-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">
                      {event.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar size={12} />
                      {event.event_date_formatted}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mb-4 line-clamp-2 flex-1">
                  {event.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin size={12} className="flex-shrink-0" />
                    <span className="truncate">{event.location?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Users size={12} className="text-gray-400" />
                    <span className="text-gray-500">
                      {event.registered_count}/{event.quota} terdaftar
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-red-500 h-1.5 rounded-full"
                        style={{
                          width: `${Math.min((event.registered_count / event.quota) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Detail <ChevronRight size={12} />
                  </button>

                  {/* Pendonor: tombol daftar | Petugas/Admin: lihat peserta */}
                  {isPendonor ? (
                    <button
                      onClick={() => registerMutation.mutate(event.id)}
                      disabled={isFull || registerMutation.isPending}
                      className="flex-1 py-2 pmi-gradient text-white rounded-xl text-xs font-medium hover:opacity-90 disabled:opacity-60 transition-opacity"
                    >
                      {isFull ? "Penuh" : "Daftar"}
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/eventparticipants/${event.id}`)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-medium hover:bg-blue-100 transition-colors"
                    >
                      <Users size={12} />
                      Peserta
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {meta && (
        <Pagination
          currentPage={meta.current_page}
          lastPage={meta.last_page}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};
