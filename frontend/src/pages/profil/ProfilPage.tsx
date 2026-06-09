import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { User, Phone, Calendar, Lock, Save, Droplets, CreditCard, Mail, Award } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import authService from '../../services/authService';
import { BloodTypeBadge } from '../../components/ui/BloodTypeBadge';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

export const ProfilPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    birth_date: user?.birth_date || '',
    blood_type: user?.blood_type || '',
    password: '',
    password_confirmation: '',
  });

  const updateMutation = useMutation({
    mutationFn: () => {
      const payload: any = {
        name: form.name,
        phone: form.phone,
        birth_date: form.birth_date,
        blood_type: form.blood_type,
      };
      if (form.password) {
        payload.password = form.password;
        payload.password_confirmation = form.password_confirmation;
      }
      return authService.updateProfile(payload);
    },
    onSuccess: (res) => {
      setUser(res.data.data);
      toast.success('Profil berhasil diperbarui!');
      setForm(prev => ({ ...prev, password: '', password_confirmation: '' }));
    },
    onError: (err: any) => {
      const errors = err.response?.data?.errors;
      if (errors) {
        const firstError = Object.values(errors)[0] as string[];
        toast.error(firstError[0]);
      } else {
        toast.error(err.response?.data?.message || 'Gagal memperbarui profil.');
      }
    },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola informasi akun dan preferensi Anda</p>
      </div>

      {/* Avatar & Info Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-200">
            <span className="text-3xl font-bold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-sm text-gray-500 capitalize mt-0.5">{user?.role} PMI</p>
            <div className="flex flex-wrap items-center gap-2 mt-3 justify-center sm:justify-start">
              {user?.blood_type && <BloodTypeBadge type={user.blood_type} size="md" />}
              <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                NIK: {user?.nik}
              </span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                {user?.email}
              </span>
            </div>
          </div>
        </div>
        <br></br>
        <button
          onClick={() => navigate('/penghargaan')}
          disabled={updateMutation.isPending || !form.name}
          className="w-full flex items-center justify-center gap-2 py-3 pmi-gradient text-white rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-opacity shadow-sm shadow-red-200"
        >
          <Award size={16} />
          {'Penghargaan'}
        </button>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-5">Edit Informasi Profil</h3>
        <div className="space-y-4">

          {/* Read-only fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Email (tidak dapat diubah)</label>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={14} className="text-gray-400" />
                {user?.email}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">NIK (tidak dapat diubah)</label>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CreditCard size={14} className="text-gray-400" />
                {user?.nik}
              </div>
            </div>
          </div>

          {/* Editable fields */}
          {[
            { label: 'Nama Lengkap', key: 'name', icon: User, type: 'text', placeholder: 'Nama sesuai KTP' },
            { label: 'Nomor Telepon', key: 'phone', icon: Phone, type: 'tel', placeholder: '08xx-xxxx-xxxx' },
            { label: 'Tanggal Lahir', key: 'birth_date', icon: Calendar, type: 'date', placeholder: '' },
          ].map(({ label, key, icon: Icon, type, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
              <div className="relative">
                <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type={type}
                  value={(form as any)[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-colors"
                />
              </div>
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Golongan Darah</label>
            <div className="relative">
              <Droplets className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={form.blood_type}
                onChange={e => setForm({ ...form, blood_type: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
              >
                <option value="">Pilih golongan darah</option>
                {['A', 'B', 'AB', 'O'].map(t => (
                  <option key={t} value={t}>Golongan {t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Password section */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Ganti Kata Sandi
              <span className="text-gray-400 font-normal ml-1">(kosongkan jika tidak ingin mengubah)</span>
            </p>
            <div className="space-y-3">
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Kata sandi baru (min. 8 karakter)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="password"
                  value={form.password_confirmation}
                  onChange={e => setForm({ ...form, password_confirmation: e.target.value })}
                  placeholder="Konfirmasi kata sandi baru"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending || !form.name}
            className="w-full flex items-center justify-center gap-2 py-3 pmi-gradient text-white rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-opacity shadow-sm shadow-red-200"
          >
            <Save size={16} />
            {updateMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
};
