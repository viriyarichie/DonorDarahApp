import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Phone,
  CreditCard,
  Eye,
  EyeOff,
  Calendar,
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import authService from "../../services/authService";
import toast from "react-hot-toast";

export const RegisterPage = () => {
  const [form, setForm] = useState({
    nik: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    birth_date: "",
    blood_type: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const res = await authService.register(form);
      setAuth(res.data.data.user, res.data.data.token);
      toast.success("Registrasi berhasil! Selamat datang di PMI Donor.");
      navigate("/dashboard");
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        toast.error(err.response?.data?.message || "Registrasi gagal.");
      }
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm({ ...form, [key]: e.target.value }),
  });

  const inputClass = (key: string) =>
    `w-full pl-11 pr-4 py-2.5 rounded-xl border text-sm transition-colors outline-none ${
      errors[key]
        ? "border-red-400 bg-red-50"
        : "border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100"
    }`;

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white-900 mb-1">
          Buat Akun Baru
        </h2>
        <p className="text-sm text-gray-100">
          Bergabunglah sebagai pendonor darah PMI
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs font-medium text-white-700 mb-1">
              NIK (16 digit)
            </label>
            <div className="relative">
              <CreditCard
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white-400"
                size={16}
              />
              <input
                id="nik"
                type="text"
                maxLength={16}
                placeholder="Nomor Induk Kependudukan"
                {...field("nik")}
                className={inputClass("nik")}
                required
              />
            </div>
            {errors.nik && (
              <p className="text-xs text-white-600 mt-1">{errors.nik[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-white-700 mb-1">
              Nama Lengkap
            </label>
            <div className="relative">
              <User
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white-400"
                size={16}
              />
              <input
                id="name"
                type="text"
                placeholder="Nama sesuai KTP"
                {...field("name")}
                className={inputClass("name")}
                required
              />
            </div>
            {errors.name && (
              <p className="text-xs text-white-600 mt-1">{errors.name[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-white-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white-400"
                size={16}
              />
              <input
                id="email"
                type="email"
                placeholder="contoh@email.com"
                {...field("email")}
                className={inputClass("email")}
                required
              />
            </div>
            {errors.email && (
              <p className="text-xs text-white-600 mt-1">{errors.email[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-white-700 mb-1">
              Nomor Telepon
            </label>
            <div className="relative">
              <Phone
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white-400"
                size={16}
              />
              <input
                id="phone"
                type="tel"
                placeholder="08xx-xxxx-xxxx"
                {...field("phone")}
                className={inputClass("phone")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-white-700 mb-1">
                Tanggal Lahir
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white-400"
                  size={16}
                />
                <input
                  id="birth_date"
                  type="date"
                  {...field("birth_date")}
                  className={inputClass("birth_date")}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-white-700 mb-1">
                Golongan Darah
              </label>
              <select
                id="blood_type"
                value={form.blood_type}
                onChange={(e) =>
                  setForm({ ...form, blood_type: e.target.value })
                }
                className="w-full px-3 py-2.5 rounded-xl border text-sm border-gray-200 focus:border-white-400 focus:ring-2 focus:ring-red-100 outline-none"
              >
                <option value="">Pilih</option>
                {["A", "B", "AB", "O"].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white-700 mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white-400"
                size={16}
              />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 8 karakter"
                {...field("password")}
                className={inputClass("password")}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white-400"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-white-600 mt-1">
                {errors.password[0]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-white-700 mb-1">
              Konfirmasi Kata Sandi
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white-400"
                size={16}
              />
              <input
                id="password_confirmation"
                type="password"
                placeholder="Ulangi kata sandi"
                {...field("password_confirmation")}
                className={inputClass("password_confirmation")}
                required
              />
            </div>
          </div>
        </div>

        <button
          id="btn-register"
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl pmi-gradient text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60 shadow-sm shadow-red-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
              Mendaftar...
            </>
          ) : (
            "Daftar Sekarang"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-white-500 mt-4">
        Sudah punya akun?{" "}
        <Link
          to="/login"
          className="text-red-300 font-semibold hover:text-red-500"
        >
          Masuk di sini
        </Link>
      </p>
    </div>
  );
};
