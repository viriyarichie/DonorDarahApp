import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/stok-darah': 'Stok Darah',
  '/booking': 'Jadwal Donor',
  '/kelola-booking': 'Kelola Booking',
  '/events': 'Event Donor',
  '/riwayat': 'Riwayat Donor',
  '/semua-donor': 'Semua Donor',
  '/kondisi': 'Kondisi Darah',
  '/penghargaan': 'Penghargaan',
  '/notifikasi': 'Notifikasi',
  '/edukasi': 'Edukasi Donor',
  '/pengguna': 'Kelola Pengguna',
  '/kelola-stok': 'Kelola Stok Darah',
  '/kelola-event': 'Kelola Event',
  '/kelola-artikel': 'Kelola Artikel',
  '/profil': 'Profil Saya',
};

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'PMI Donor';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-72 min-w-0">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          title={title}
        />
        <main className="flex-1 p-4 lg:p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
