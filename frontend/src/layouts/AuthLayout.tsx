import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Droplets } from 'lucide-react';

export const AuthLayout = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left - Decorative */}
      <div className="hidden lg:flex w-1/2 pmi-gradient flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Background circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/5 rounded-full" />

        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <Droplets className="text-white" size={40} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Sistem Donor Darah
          </h1>
          <p className="text-red-100 text-lg font-semibold mb-2">Palang Merah Indonesia</p>
          <p className="text-red-200 text-sm max-w-xs">
            Setetes darah Anda adalah harapan bagi mereka yang membutuhkan.
            Bergabunglah dan jadilah pahlawan kemanusiaan.
          </p>

          <div className="grid grid-cols-3 gap-4 mt-10">
            {[
              { value: '10K+', label: 'Pendonor' },
              { value: '50K+', label: 'Donor Selesai' },
              { value: '100K+', label: 'Nyawa Terselamatkan' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-red-200 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
              <Droplets className="text-white" size={20} />
            </div>
            <div>
              <div className="font-bold text-gray-900">PMI Donor</div>
              <div className="text-xs text-gray-500">Sistem Donor Darah</div>
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
