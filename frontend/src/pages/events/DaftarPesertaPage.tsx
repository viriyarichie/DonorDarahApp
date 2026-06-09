import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Calendar, Users, User, CheckCircle } from "lucide-react";
import eventService from "../../services/eventService";
import { useAuthStore } from "../../stores/authStore";
import { PageSkeleton } from "../../components/ui/LoadingSkeleton";
import { BloodTypeBadge } from "../../components/ui/BloodTypeBadge";
import toast from "react-hot-toast";

export const DaftarPesertaPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const qc = useQueryClient();
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const { user } = useAuthStore();
    const isPendonor = user?.role === "pendonor";

    const { data, isLoading } = useQuery({
        queryKey: ["event", id],
        queryFn: () => eventService.getById(Number(id)),
        enabled: !!id,
    });

    // Hanya petugas/admin yang memuat daftar peserta
    const { data: participantsData } = useQuery({
        queryKey: ["event-participants", id],
        queryFn: () => eventService.getParticipants(Number(id)),
        enabled: !!id && !isPendonor,
    });

    const registerMutation = useMutation({
        mutationFn: () => eventService.register(Number(id)),
        onSuccess: () => {
            toast.success("Pendaftaran event berhasil! Cek Jadwal Donor untuk detailnya.");
            qc.invalidateQueries({ queryKey: ["event", id] });
        },
        onError: (err: any) => {
            toast.error(
                err.response?.data?.errors?.event_id?.[0] || "Gagal mendaftar.",
            );
        },
    });

    const event = data?.data?.data;
    const participants: any[] = participantsData?.data?.data || [];
    const eventInfo: any = participantsData?.data?.event;

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
            {/* Petugas/Admin: info peran */}
            {!isPendonor && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-700">
                    Anda dapat memantau daftar peserta di bawah ini. Hanya pendonor yang dapat mendaftar ke event.
                </div>
            )}


            {/* Daftar Peserta – hanya untuk petugas/admin */}
            {!isPendonor && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="font-bold text-gray-900">
                            Daftar Peserta Terdaftar
                        </h2>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                            {participants.length} peserta
                        </span>
                    </div>

                    {participants.length === 0 ? (
                        <div className="px-6 py-10 text-center text-sm text-gray-400">
                            Belum ada peserta yang mendaftar ke event ini.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pendonor</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Gol. Darah</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">No. HP</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Waktu Daftar</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {participants.map((p: any) => (
                                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <span className="text-red-700 font-bold text-xs">
                                                            {p.user?.name?.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-800">{p.user?.name}</div>
                                                        <div className="text-xs text-gray-400">{p.user?.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3">
                                                {p.user?.blood_type
                                                    ? <span className="text-s text-gray-400">{p.user?.blood_type}</span>
                                                    : <span className="text-xs text-gray-400">—</span>
                                                }
                                            </td>
                                            <td className="px-6 py-3 text-sm text-gray-600">{p.user?.phone || '—'}</td>
                                            <td className="px-6 py-3 text-sm text-gray-500">{p.registered_at}</td>
                                            <td className="px-6 py-3">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${p.status === 'hadir' ? 'bg-green-100 text-green-700' :
                                                        p.status === 'batal' ? 'bg-red-100 text-red-600' :
                                                            'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {p.status === 'terdaftar' && <CheckCircle size={10} />}
                                                    {p.status === 'terdaftar' ? 'Terdaftar' : p.status === 'hadir' ? 'Hadir' : 'Batal'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
