import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Calendar, Users, User } from "lucide-react";
import eventService from "../../services/eventService";
import { PageSkeleton } from "../../components/ui/LoadingSkeleton";
import toast from "react-hot-toast";

export const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: () => eventService.getById(Number(id)),
    enabled: !!id,
  });

  const registerMutation = useMutation({
    mutationFn: () => eventService.register(Number(id)),
    onSuccess: () => {
      toast.success("Pendaftaran event berhasil!");
      qc.invalidateQueries({ queryKey: ["event", id] });
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.errors?.event_id?.[0] || "Gagal mendaftar.",
      );
    },
  });

  const event = data?.data?.data;

  useEffect(() => {
    if (!event?.location?.latitude || !mapRef.current || mapInstanceRef.current)
      return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!).setView(
        [event.location!.latitude!, event.location!.longitude!],
        15,
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      L.marker([event.location!.latitude!, event.location!.longitude!])
        .addTo(map)
        .bindPopup(`<b>${event.name}</b><br>${event.location!.address}`)
        .openPopup();

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [event]);

  if (isLoading) return <PageSkeleton />;
  if (!event)
    return (
      <div className="text-center py-12 text-gray-500">
        Event tidak ditemukan.
      </div>
    );

  const isFull = event.registered_count >= event.quota;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft size={16} />
        Kembali ke Daftar Event
      </button>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <MapPin className="text-red-600" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{event.name}</h1>
            <div className="text-sm text-gray-500 mt-1">
              {event.event_date_formatted}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Calendar size={13} />
              Tanggal
            </div>
            <div className="text-sm font-semibold text-black">
              {event.event_date_formatted}
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Users size={13} />
              Peserta
            </div>
            <div className="text-sm font-semibold text-black">
              {event.registered_count}/{event.quota}
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <User size={13} />
              Penyelenggara
            </div>
            <div className="text-sm font-semibold text-black">
              {event.creator?.name || "PMI"}
            </div>
          </div>
        </div>

        <div className="mb-5">
          <h3 className="font-semibold text-gray-900 mb-2">Deskripsi</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {event.description}
          </p>
        </div>

        <div className="mb-5">
          <h3 className="font-semibold text-gray-900 mb-2">Lokasi</h3>
          <div className="flex items-start gap-2 mb-3">
            <MapPin size={15} className="text-red-500 mt-0.5" />
            <div>
              <div className="text-sm font-medium">{event.location?.name}</div>
              <div className="text-xs text-gray-500">
                {event.location?.address}
              </div>
            </div>
          </div>
          {event.location?.latitude && (
            <div ref={mapRef} className="map-container" />
          )}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 bg-gray-100 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${isFull ? "bg-red-500" : "pmi-gradient"}`}
              style={{
                width: `${Math.min((event.registered_count / event.quota) * 100, 100)}%`,
              }}
            />
          </div>
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {event.registered_count}/{event.quota} terdaftar
          </span>
        </div>

        <button
          onClick={() => registerMutation.mutate()}
          disabled={isFull || registerMutation.isPending}
          className="w-full py-3 pmi-gradient text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity"
        >
          {isFull
            ? "Kuota Penuh"
            : registerMutation.isPending
              ? "Mendaftar..."
              : "Daftar Event Ini"}
        </button>
      </div>
    </div>
  );
};
