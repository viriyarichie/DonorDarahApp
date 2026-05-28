<?php

namespace App\Services;

use App\Models\Article;
use App\Models\User;

class ArticleService
{
    public function getPublishedArticles(array $filters = [])
    {
        $query = Article::with('author')->published();

        if (!empty($filters['search'])) {
            $query->where('title', 'like', '%' . $filters['search'] . '%');
        }

        return $query->orderByDesc('published_at')->paginate(10);
    }

    public function getAllArticles(array $filters = [])
    {
        $query = Article::with('author');

        if (!empty($filters['search'])) {
            $query->where('title', 'like', '%' . $filters['search'] . '%');
        }

        return $query->orderByDesc('created_at')->paginate(10);
    }

    public function createArticle(array $data, User $author): Article
    {
        return Article::create([
            'title' => $data['title'],
            'content' => $data['content'],
            'image_path' => $data['image_path'] ?? null,
            'published_at' => isset($data['publish']) && $data['publish'] ? now() : null,
            'user_id' => $author->id,
        ])->load('author');
    }

    public function updateArticle(Article $article, array $data): Article
    {
        $updateData = [
            'title' => $data['title'] ?? $article->title,
            'content' => $data['content'] ?? $article->content,
        ];

        if (isset($data['publish'])) {
            $updateData['published_at'] = $data['publish'] ? now() : null;
        }

        $article->update($updateData);
        return $article->fresh('author');
    }

    public function deleteArticle(Article $article): void
    {
        $article->delete();
    }
}
