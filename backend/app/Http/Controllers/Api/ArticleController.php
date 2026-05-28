<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ArticleRequest;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use App\Services\ArticleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function __construct(private ArticleService $articleService) {}

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $filters = $request->only(['search']);

        if ($user && ($user->isAdmin() || $user->isPetugas())) {
            $articles = $this->articleService->getAllArticles($filters);
        } else {
            $articles = $this->articleService->getPublishedArticles($filters);
        }

        return response()->json([
            'data' => ArticleResource::collection($articles),
            'meta' => [
                'current_page' => $articles->currentPage(),
                'last_page' => $articles->lastPage(),
                'total' => $articles->total(),
            ],
        ]);
    }

    public function show(Article $article): JsonResponse
    {
        return response()->json(['data' => new ArticleResource($article->load('author'))]);
    }

    public function store(ArticleRequest $request): JsonResponse
    {
        $article = $this->articleService->createArticle($request->validated(), $request->user());
        return response()->json([
            'message' => 'Artikel berhasil dibuat.',
            'data' => new ArticleResource($article),
        ], 201);
    }

    public function update(ArticleRequest $request, Article $article): JsonResponse
    {
        $article = $this->articleService->updateArticle($article, $request->validated());
        return response()->json([
            'message' => 'Artikel berhasil diperbarui.',
            'data' => new ArticleResource($article),
        ]);
    }

    public function destroy(Article $article): JsonResponse
    {
        $this->articleService->deleteArticle($article);
        return response()->json(['message' => 'Artikel berhasil dihapus.']);
    }
}
