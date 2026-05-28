import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Droplets, Calendar, MapPin, Clock, Heart,
  Award, Bell, BookOpen, Users, LogOut, X, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import authService from '../../services/authService';
import toast from 'react-hot-toast';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  roles: string[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['pendonor', 'petugas', 'admin'] },
  { label: 'Stok Darah', path: '/stok-darah', icon: Droplets, roles: ['pendonor', 'petugas', 'admin'] },
  { label: 'Jadwal Donor', path: '/booking', icon: Calendar, roles: ['pendonor'] },
  { label: 'Kelola Booking', path: '/kelola-booking', icon: Calendar, roles: ['petugas', 'admin'] },
  { label: 'Event Donor', path: '/events', icon: MapPin, roles: ['pendonor', 'petugas', 'admin'] },
  { label: 'Riwayat Donor', path: '/riwayat', icon: Clock, roles: ['pendonor'] },
  { label: 'Semua Donor', path: '/semua-donor', icon: Clock, roles: ['petugas', 'admin'] },
  { label: 'Kondisi Darah', path: '/kondisi', icon: Heart, roles: ['pendonor'] },
  { label: 'Penghargaan', path: '/penghargaan', icon: Award, roles: ['pendonor', 'petugas', 'admin'] },
  { label: 'Notifikasi', path: '/notifikasi', icon: Bell, roles: ['pendonor', 'petugas', 'admin'] },
  { label: 'Edukasi', path: '/edukasi', icon: BookOpen, roles: ['pendonor', 'petugas', 'admin'] },
  { label: 'Kelola Pengguna', path: '/pengguna', icon: Users, roles: ['admin'] },
  { label: 'Kelola Stok', path: '/kelola-stok', icon: Droplets, roles: ['petugas', 'admin'] },
  { label: 'Kelola Event', path: '/kelola-event', icon: MapPin, roles: ['petugas', 'admin'] },
  { label: 'Kelola Artikel', path: '/kelola-artikel', icon: BookOpen, roles: ['admin'] },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const filteredNav = navItems.filter(item => user && item.roles.includes(user.role));

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (_) {}
    logout();
    navigate('/login');
    toast.success('Berhasil keluar.');
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-40 flex flex-col transition-transform duration-300
          lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 pmi-gradient flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Droplets className="text-white" size={18} />
              </div>
              <span className="text-white font-bold text-lg">PMI Donor</span>
            </div>
            <p className="text-red-100 text-xs">Sistem Donor Darah</p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-white/80 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-700 font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-800 truncate">{user?.name}</div>
              <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {filteredNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-red-600 text-white shadow-sm shadow-red-200'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={18} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight size={14} className="text-red-200" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-700 transition-all group"
          >
            <LogOut size={18} className="text-gray-400 group-hover:text-red-500" />
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
};
