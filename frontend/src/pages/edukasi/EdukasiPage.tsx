import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { BookOpen, Search, Calendar, ChevronRight } from "lucide-react";
import articleService from "../../services/articleService";
import { PageSkeleton } from "../../components/ui/LoadingSkeleton";
import { EmptyState } from "../../components/ui/EmptyState";
import { Pagination } from "../../components/ui/Pagination";

export const EdukasiPage = () => {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["articles", search, page],
    queryFn: () => articleService.getAll({ search, page }),
  });

  const articles = data?.data?.data || [];
  const meta = data?.data?.meta;

  const stripHtml = (html: string) =>
    html.replace(/<[^>]*>/g, "").slice(0, 150) + "...";

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Edukasi Donor Darah
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Artikel dan informasi seputar donor darah
        </p>
      </div>

      {/* Search */}
      <div className="flex gap-3">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
