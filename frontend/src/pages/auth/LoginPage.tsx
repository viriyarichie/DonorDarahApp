import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Droplets } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import authService from "../../services/authService";
import toast from "react-hot-toast";

export const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
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
      const res = await authService.login(form);
      setAuth(res.data.data.user, res.data.data.token);
      toast.success("Selamat datang, " + res.data.data.user.name + "!");
      navigate("/dashboard");
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        toast.error(
          err.response?.data?.message ||
            "Login gagal. Periksa email dan kata sandi Anda.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white-900 mb-2">
          Selamat Datang!
        </h2>
        <p className="text-white-500">Masuk ke akun PMI Donor Anda</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-white-700 mb-1.5">
            Email
          </label>
          <div className="relative">
            <Mail
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white-400"
              size={18}
            />
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="contoh@email.com"
              className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm transition-colors outline-none text-white ${
                errors.email
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100"
              }`}
              required
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-600 mt-1">{errors.email[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-white-700 mb-1.5">
            Kata Sandi
          </label>
          <div className="relative">
            <Lock
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white-400"
              size={18}
            />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Minimal 8 karakter"
              className={`w-full pl-11 pr-12 py-3 rounded-xl border text-sm transition-colors outline-none text-white ${
                errors.password
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100"
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-600 mt-1">{errors.password[0]}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-white-600 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-white-300 text-red-600"
            />
            Ingat saya
          </label>
          <Link
            to="/lupa-sandi"
            className="text-sm text-blue-600 hover:text-gray-600 font-medium"
          >
            Lupa kata sandi?
          </Link>
        </div>

        <button
          id="btn-login"
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl pmi-gradient text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60 shadow-sm shadow-red-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
              Memproses...
            </>
          ) : (
            "Masuk"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-white-500 mt-6">
        Belum punya akun?{" "}
        <Link
          to="/registrasi"
          className="text-blue-600 font-semibold hover:text-gray-700"
        >
          Daftar sekarang
        </Link>
      </p>

      {/* Demo accounts */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <p className="text-xs font-semibold text-blue-700 mb-2">Akun Demo:</p>
        <div className="space-y-1 text-xs text-blue-600">
          <div className="flex justify-between">
            <span>Admin:</span>
            <span>admin@pmi.or.id / password123</span>
          </div>
          <div className="flex justify-between">
            <span>Petugas:</span>
            <span>petugas@pmi.or.id / password123</span>
          </div>
          <div className="flex justify-between">
            <span>Pendonor:</span>
            <span>siti@example.com / password123</span>
          </div>
        </div>
      </div>
    </div>
  );
};
