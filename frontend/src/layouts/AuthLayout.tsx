import React, { useState } from "react";
import { Outlet, Navigate, useParams } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { Droplets } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Search,
  Calendar,
  ChevronRight,
  ArrowLeft,
  User,
} from "lucide-react";
import articleService from "../services/articleService";
import { PageSkeleton } from "../components/ui/LoadingSkeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { Pagination } from "../components/ui/Pagination";

export const AuthLayout = () => {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { id: artikelId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["articles", search, page],
    queryFn: () => articleService.getAll({ search, page }),
    enabled: !artikelId,
  });

  const { data: detailData, isLoading: isDetailLoading } = useQuery({
    queryKey: ["article", artikelId],
    queryFn: () => articleService.getById(Number(artikelId)),
    enabled: !!artikelId,
  });

  const articles = data?.data?.data || [];
  const meta = data?.data?.meta;
  const article = detailData?.data?.data;

  const stripHtml = (html: string) =>
    html.replace(/<[^>]*>/g, "").slice(0, 150) + "...";

  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  if (isLoading || isDetailLoading) return <PageSkeleton />;

  const renderLeftPanel = () => {
    // ── Detail artikel ──────────────────────────────────────────
    if (artikelId) {
      if (!article) {
        return (
          <div className="text-center py-16">
            <BookOpen className="text-gray-300 mx-auto mb-3" size={48} />
            <p className="text-gray-500">Artikel tidak ditemukan.</p>
            <button
              onClick={() => navigate("/edukasi")}
              className="mt-4 text-red-600 text-sm font-medium hover:text-red-700"
            >
              ← Kembali ke Edukasi
            </button>
          </div>
        );
      }

      return (
        <div className="max-w-3xl mx-auto space-y-6 p-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={16} />
            Kembali ke Edukasi
          </button>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            {/* Badge */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <BookOpen className="text-red-600" size={16} />
              </div>
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                Artikel Edukasi
              </span>
            </div>

            {/* Judul */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-4 text-xs text-gray-400 mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-1.5">
                <User size={13} />
                {article.author?.name || "PMI"}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={13} />
                {article.published_at}
              </div>
            </div>

            {/* Konten */}
            <div
              className="prose prose-sm max-w-none text-gray-700
                [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:text-gray-900 [&>h1]:mt-6 [&>h1]:mb-3
                [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mt-6 [&>h2]:mb-3
                [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-gray-800 [&>h3]:mt-4 [&>h3]:mb-2
                [&>p]:leading-relaxed [&>p]:mb-4 [&>p]:text-gray-600
                [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ul]:mb-4
                [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2 [&>ol]:mb-4
                [&>li]:text-gray-600
                [&>blockquote]:border-l-4 [&>blockquote]:border-red-300 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-500
                [&>strong]:font-semibold [&>strong]:text-gray-800"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </div>
      );
    }

    // ── Daftar artikel ──────────────────────────────────────────
    return (
      <div className="p-6 overflow-y-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Edukasi Donor Darah
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Artikel dan informasi seputar donor darah
          </p>
        </div>

        <div className="flex gap-3 mt-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (setSearch(searchInput), setPage(1))
              }
              placeholder="Cari artikel..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400 text-black"
            />
          </div>
          <button
            onClick={() => {
              setSearch(searchInput);
              setPage(1);
            }}
            className="px-4 py-2.5 pmi-gradient text-white rounded-xl text-sm font-medium"
          >
            Cari
          </button>
        </div>

        {articles.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Artikel tidak ditemukan"
            description={
              search
                ? `Tidak ada artikel untuk pencarian "${search}"`
                : "Belum ada artikel yang dipublikasikan."
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {articles.map((article) => (
              <button
                key={article.id}
                onClick={() => navigate(`/edukasi/${article.id}`)}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-left card-hover transition-all"
              >
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-3">
                  <BookOpen className="text-red-600" size={18} />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-3">
                  {stripHtml(article.content)}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Calendar size={12} />
                    {article.published_at}
                  </div>
                  <div className="flex items-center gap-1 text-red-600 text-xs font-medium">
                    Baca selengkapnya <ChevronRight size={12} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {meta && (
          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            onPageChange={setPage}
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left - hidden on mobile when viewing article detail */}
      <div
        className={`${artikelId ? "hidden md:block" : "block"} w-full md:w-1/2 overflow-y-auto bg-gray-50`}
      >
        {renderLeftPanel()}
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 pmi-gradient relative overflow-hidden min-h-[60vh] md:min-h-screen">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/5 rounded-full" />
        <div className="flex-1 flex items-center justify-center p-6 relative">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
              <Droplets className="text-white" size={20} />
            </div>
            <div>
              <div className="font-bold text-gray-900">PMI Donor</div>
              <div className="text-xs text-white-500">Sistem Donor Darah</div>
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
