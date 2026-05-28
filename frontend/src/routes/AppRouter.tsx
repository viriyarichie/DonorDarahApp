import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AuthGuard } from '../components/guards/AuthGuard';
import { RoleGuard } from '../components/guards/RoleGuard';
import { PageSkeleton } from '../components/ui/LoadingSkeleton';

// Auth pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));

// Dashboard
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));

// Feature pages
const StokDarahPage = lazy(() => import('../pages/stok/StokDarahPage').then(m => ({ default: m.StokDarahPage })));
const KelolaStokPage = lazy(() => import('../pages/stok/KelolaStokPage').then(m => ({ default: m.KelolaStokPage })));
const BookingPage = lazy(() => import('../pages/booking/BookingPage').then(m => ({ default: m.BookingPage })));
const KelolaBookingPage = lazy(() => import('../pages/booking/KelolaBookingPage').then(m => ({ default: m.KelolaBookingPage })));
const EventListPage = lazy(() => import('../pages/events/EventListPage').then(m => ({ default: m.EventListPage })));
const EventDetailPage = lazy(() => import('../pages/events/EventDetailPage').then(m => ({ default: m.EventDetailPage })));
const KelolaEventPage = lazy(() => import('../pages/events/KelolaEventPage').then(m => ({ default: m.KelolaEventPage })));
const RiwayatDonorPage = lazy(() => import('../pages/riwayat/RiwayatDonorPage').then(m => ({ default: m.RiwayatDonorPage })));
const SemuaDonorPage = lazy(() => import('../pages/riwayat/SemuaDonorPage').then(m => ({ default: m.SemuaDonorPage })));
const KondisiDarahPage = lazy(() => import('../pages/kondisi/KondisiDarahPage').then(m => ({ default: m.KondisiDarahPage })));
const PenghargaanPage = lazy(() => import('../pages/penghargaan/PenghargaanPage').then(m => ({ default: m.PenghargaanPage })));
const NotifikasiPage = lazy(() => import('../pages/notifikasi/NotifikasiPage').then(m => ({ default: m.NotifikasiPage })));
const EdukasiPage = lazy(() => import('../pages/edukasi/EdukasiPage').then(m => ({ default: m.EdukasiPage })));
const ArtikelDetailPage = lazy(() => import('../pages/edukasi/ArtikelDetailPage').then(m => ({ default: m.ArtikelDetailPage })));
const KelolaArtikelPage = lazy(() => import('../pages/edukasi/KelolaArtikelPage').then(m => ({ default: m.KelolaArtikelPage })));
const ProfilPage = lazy(() => import('../pages/profil/ProfilPage').then(m => ({ default: m.ProfilPage })));

const Loading = () => <div className="p-6"><PageSkeleton /></div>;

export const AppRouter = () => (
  <BrowserRouter>
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registrasi" element={<RegisterPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<AuthGuard />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/stok-darah" element={<StokDarahPage />} />
            <Route path="/events" element={<EventListPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/notifikasi" element={<NotifikasiPage />} />
            <Route path="/edukasi" element={<EdukasiPage />} />
            <Route path="/edukasi/:id" element={<ArtikelDetailPage />} />
            <Route path="/profil" element={<ProfilPage />} />
            <Route path="/penghargaan" element={<PenghargaanPage />} />

            {/* Pendonor only */}
            <Route path="/booking" element={
              <RoleGuard allowedRoles={['pendonor']}>
                <BookingPage />
              </RoleGuard>
            } />
            <Route path="/riwayat" element={
              <RoleGuard allowedRoles={['pendonor']}>
                <RiwayatDonorPage />
              </RoleGuard>
            } />
            <Route path="/kondisi" element={
              <RoleGuard allowedRoles={['pendonor']}>
                <KondisiDarahPage />
              </RoleGuard>
            } />

            {/* Petugas + Admin */}
            <Route path="/kelola-booking" element={
              <RoleGuard allowedRoles={['petugas', 'admin']}>
                <KelolaBookingPage />
              </RoleGuard>
            } />
            <Route path="/semua-donor" element={
              <RoleGuard allowedRoles={['petugas', 'admin']}>
                <SemuaDonorPage />
              </RoleGuard>
            } />
            <Route path="/kelola-stok" element={
              <RoleGuard allowedRoles={['petugas', 'admin']}>
                <KelolaStokPage />
              </RoleGuard>
            } />
            <Route path="/kelola-event" element={
              <RoleGuard allowedRoles={['petugas', 'admin']}>
                <KelolaEventPage />
              </RoleGuard>
            } />

            {/* Admin only */}
            <Route path="/kelola-artikel" element={
              <RoleGuard allowedRoles={['admin']}>
                <KelolaArtikelPage />
              </RoleGuard>
            } />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);
