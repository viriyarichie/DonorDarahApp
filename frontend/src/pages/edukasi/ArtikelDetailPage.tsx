import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, User, BookOpen } from 'lucide-react';
import articleService from '../../services/articleService';
import { PageSkeleton } from '../../components/ui/LoadingSkeleton';

export const ArtikelDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: () => articleService.getById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) return <PageSkeleton />;

  const article = data?.data?.data;
  if (!article) {
    return (
      <div className="text-center py-16">
        <BookOpen className="text-gray-300 mx-auto mb-3" size={48} />
        <p className="text-gray-500">Artikel tidak ditemukan.</p>
        <button
          onClick={() => navigate('/edukasi')}
          className="mt-4 text-red-600 text-sm font-medium hover:text-red-700"
        >
          ← Kembali ke Edukasi
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft size={16} />
        Kembali ke Edukasi
      </button>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <BookOpen className="text-red-600" size={16} />
          </div>
          <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
            Artikel Edukasi
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">{article.title}</h1>

        <div className="flex items-center gap-4 text-xs text-gray-400 mb-6 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-1.5">
            <User size={13} />
            {article.author?.name || 'PMI'}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={13} />
            {article.published_at}
          </div>
        </div>

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
};
