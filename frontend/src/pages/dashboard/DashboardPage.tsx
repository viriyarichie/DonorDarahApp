import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Droplets, Users, Calendar, TrendingUp, Heart, Award,
  Clock, ChevronRight, AlertCircle, CheckCircle, MapPin
} from 'lucide-react';
import api from '../../services/api';
import { useAuthStore } from '../../stores/authStore';
import { StatsCard } from '../../components/ui/StatsCard';
import { PageSkeleton } from '../../components/ui/LoadingSkeleton';
import { BloodTypeBadge } from '../../components/ui/BloodTypeBadge';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import type { DashboardData } from '../../types';

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get<{ data: DashboardData }>('/dashboard'),
  });

  if (isLoading) return <PageSkeleton />;

  const dashData = data?.data?.data;
  const isAdminOrPetugas = user?.role === 'admin' || user?.role === 'petugas';

  const stockColors: Record<string, string> = {
    aman: 'text-green-700 bg-green-50 border-green-200',
    perlu_perhatian: 'text-amber-700 bg-amber-50 border-amber-200',
    kritis: 'text-red-700 bg-red-50 border-red-200',
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="pmi-gradient rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute right-16 bottom-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10">
          <p className="text-red-100 text-sm font-medium">Selamat Datang,</p>
          <h2 className="text-2xl font-bold mt-1">{user?.name} 👋</h2>
          <p className="text-red-100 text-sm mt-2">
            {isAdminOrPetugas
              ? 'Pantau dan kelola aktivitas donor darah hari ini.'
              : 'Jadilah pahlawan. Setiap tetes darah menyelamatkan nyawa.'}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {isAdminOrPetugas ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsCard
            title="Total Donor"
            value={dashData?.stats?.total_donors?.toLocaleString('id-ID') || '0'}
            icon={Heart}
            color="red"
            trend="+12% bulan ini"
          />
          <StatsCard
            title="Total Pendonor"
            value={dashData?.stats?.total_users?.toLocaleString('id-ID') || '0'}
            icon={Users}
            color="blue"
            trend="+5 minggu ini"
          />
          <StatsCard
            title="Booking Aktif"
            value={dashData?.stats?.total_bookings?.toLocaleString('id-ID') || '0'}
            icon={Calendar}
            color="amber"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsCard
            title="Total Donor Saya"
            value={dashData?.total_donor || 0}
            icon={Heart}
            color="red"
            subtitle={dashData?.next_milestone ? `Menuju ${dashData.next_milestone}x` : 'Hebat!'}
          />
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="text-green-600" size={20} />
              </div>
              <span className="text-sm font-medium text-gray-600">Status Donor</span>
            </div>
            {dashData?.next_eligible_date ? (
              new Date(dashData.next_eligible_date) > new Date() ? (
                <>
                  <div className="text-sm font-bold text-amber-600">Belum Bisa Donor</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Bisa donor: {new Date(dashData.next_eligible_date).toLocaleDateString('id-ID')}
                  </div>
                </>
              ) : (
                <div className="text-sm font-bold text-green-600">Siap Donor! ✓</div>
              )
            ) : (
              <div className="text-sm font-bold text-green-600">Belum Pernah Donor</div>
            )}
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Award className="text-purple-600" size={20} />
              </div>
              <span className="text-sm font-medium text-gray-600">Progress Penghargaan</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {dashData?.total_donor || 0} / {dashData?.next_milestone || '100'}
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="pmi-gradient h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(dashData?.progress_to_next || 0, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">Aktivitas Donor</h3>
            <TrendingUp className="text-red-500" size={20} />
          </div>
          {dashData?.donor_activity ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={dashData.donor_activity}>
                <defs>
                  <linearGradient id="donorGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94A3B8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Area
                  type="monotone" dataKey="count" name="Donor"
                  stroke="#DC2626" strokeWidth={2}
                  fill="url(#donorGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              Belum ada data aktivitas
            </div>
          )}
        </div>

        {/* Stok Darah */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Stok Darah</h3>
            <button
              onClick={() => navigate('/stok-darah')}
              className="text-xs text-red-600 font-medium hover:text-red-700 flex items-center gap-1"
            >
              Lihat semua <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {dashData?.stock_summary && Object.entries(dashData.stock_summary).map(([type, info]) => (
              <div key={type} className={`flex items-center justify-between p-3 rounded-xl border ${
                stockColors[info.status] || ''
              }`}>
                <div className="flex items-center gap-2">
                  <BloodTypeBadge type={type} size="sm" />
                  <span className="text-xs font-medium capitalize">{info.status.replace('_', ' ')}</span>
                </div>
                <span className="font-bold text-sm">{info.total} kantong</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent/Upcoming Events */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Event Terdekat</h3>
            <button
              onClick={() => navigate('/events')}
              className="text-xs text-red-600 font-medium hover:text-red-700 flex items-center gap-1"
            >
              Lihat semua <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {dashData?.upcoming_events?.length ? dashData.upcoming_events.map((event) => (
              <button
                key={event.id}
                onClick={() => navigate(`/events/${event.id}`)}
                className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-red-600" size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 truncate">{event.name}</div>
                  <div className="text-xs text-gray-500">{event.date}</div>
                  <div className="text-xs text-gray-400 truncate">{event.location}</div>
                </div>
                <ChevronRight size={14} className="text-gray-400 mt-1" />
              </button>
            )) : (
              <p className="text-sm text-gray-400 text-center py-4">Tidak ada event mendatang</p>
            )}
          </div>
        </div>

        {/* Active Booking (pendonor) / Recent Donors (admin) */}
        {!isAdminOrPetugas && dashData?.active_booking ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Booking Aktif</h3>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="text-blue-600" size={18} />
                <span className="text-sm font-semibold text-blue-800">Jadwal Donor</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tanggal</span>
                  <span className="font-medium">{dashData.active_booking.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Lokasi</span>
                  <span className="font-medium text-right max-w-xs truncate">{dashData.active_booking.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <StatusBadge status={dashData.active_booking.status} />
                </div>
              </div>
            </div>
          </div>
        ) : isAdminOrPetugas && dashData?.recent_donors ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Donor Terbaru</h3>
              <button
                onClick={() => navigate('/semua-donor')}
                className="text-xs text-red-600 font-medium flex items-center gap-1"
              >
                Lihat semua <ChevronRight size={12} />
              </button>
            </div>
            <div className="space-y-3">
              {dashData.recent_donors.map((d, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-700 font-bold text-xs">{d.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">{d.name}</div>
                    <div className="text-xs text-gray-400">{d.date}</div>
                  </div>
                  <BloodTypeBadge type={d.blood_type || '?'} size="sm" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-center">
            <div className="text-center">
              <Calendar className="text-gray-300 mx-auto mb-2" size={32} />
              <p className="text-sm text-gray-400">Belum ada booking aktif</p>
              <button
                onClick={() => navigate('/booking')}
                className="mt-3 text-xs text-red-600 font-medium"
              >
                Buat Jadwal Donor →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
