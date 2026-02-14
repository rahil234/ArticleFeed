'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { ArticleCard } from '@/components/article-card';
import { useAuth } from '@/lib/auth-context';
import type { Article } from '@/lib/types';
import { articleService } from '@/services/article.service';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // If user is logged in, redirect to dashboard
    useEffect(() => {
        if (!authLoading && user) {
            router.push('/dashboard');
        }
    }, [user, authLoading, router]);

    const fetchArticles = async () => {
        try {
            const { data } = await articleService.getPublicArticles();
            setArticles(data?.data || []);
        } catch (error) {
            console.error('Failed to fetch articles:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && !user) {
            fetchArticles();
        }
    }, [user, authLoading]);

    // Show loading while checking auth
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // If user is logged in, show loading while redirecting
    if (user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-balance mb-2">
                        Discover Articles
                    </h1>
                    <p className="text-muted-foreground">
                        Explore interesting articles from our community
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : articles.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            No articles found. Check back later!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article) => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
