'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Navigation } from '@/components/navigation';
import { useAuth } from '@/lib/auth-context';
import type { Article } from '@/lib/types';
import { articleService } from '@/services/article.service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Loader2,
    ThumbsUp,
    ThumbsDown,
    Ban,
    Calendar,
    User,
    ArrowLeft,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LoginModal } from '@/components/login-modal';

export default function ArticleDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const { toast } = useToast();
    const [article, setArticle] = useState<Article | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isInteracting, setIsInteracting] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const fetchArticle = useCallback(async () => {
        try {
            const { data, error } = user
                ? await articleService.getById(params.id as string)
                : await articleService.getPublicById(params.id as string);

            if (error || !data?.success) {
                throw new Error(error || 'Failed to fetch article');
            }

            setArticle(data.data);
        } catch (error) {
            console.error('Failed to fetch article:', error);
            toast({
                title: 'Error',
                description: 'Failed to load article',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }, [params.id, user, toast]);

    useEffect(() => {
        if (params.id) {
            fetchArticle();
        }
    }, [params.id, fetchArticle]);

    const handleInteraction = async (type: 'like' | 'dislike' | 'block') => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }

        if (!article) return;

        setIsInteracting(true);
        try {
            const { error } = await articleService.interact(article.id, type);

            if (error) {
                toast({
                    title: 'Error',
                    description: error || 'Failed to interact with article',
                    variant: 'destructive',
                });
                return;
            }

            toast({
                title: 'Success',
                description: `Article ${type}d successfully`,
            });
            fetchArticle();
        } catch {
            toast({
                title: 'Error',
                description: 'Failed to interact with article',
                variant: 'destructive',
            });
        } finally {
            setIsInteracting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <main className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">
                            Article not found
                        </h1>
                        <Button onClick={() => router.back()}>Go Back</Button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

                <article className="space-y-6">
                    <div>
                        <h1 className="text-4xl font-bold text-balance mb-4">
                            {article.title}
                        </h1>
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span>{article.authorName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                        {new Date(
                                            article.createdAt,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <Badge>{article.category}</Badge>
                        </div>
                    </div>

                    {article.images?.[0] && (
                        <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                            <Image
                                src={article.images[0] || '/placeholder.svg'}
                                width={800}
                                height={450}
                                alt={article.title}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    )}

                    <div className="prose prose-lg max-w-none">
                        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                            {article.description}
                        </p>
                        <div
                            className="article-content text-foreground leading-relaxed"
                            dangerouslySetInnerHTML={{
                                __html: article.content,
                            }}
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    {user ? (
                        <div className="flex items-center gap-3 pt-6 border-t">
                            <Button
                                variant={
                                    article.isLiked ? 'default' : 'outline'
                                }
                                size="lg"
                                onClick={() => handleInteraction('like')}
                                disabled={isInteracting}
                                className="gap-2"
                            >
                                <ThumbsUp className="h-4 w-4" />
                                {article.likes > 0
                                    ? `Like (${article.likes})`
                                    : 'Like'}
                            </Button>
                            <Button
                                variant={
                                    article.isDisliked ? 'default' : 'outline'
                                }
                                size="lg"
                                onClick={() => handleInteraction('dislike')}
                                disabled={isInteracting}
                                className="gap-2"
                            >
                                <ThumbsDown className="h-4 w-4" />
                                {article.dislikes > 0
                                    ? `Dislike (${article.dislikes})`
                                    : 'Dislike'}
                            </Button>
                            <Button
                                variant="destructive"
                                size="lg"
                                onClick={() => handleInteraction('block')}
                                disabled={isInteracting}
                                className="gap-2 ml-auto"
                            >
                                <Ban className="h-4 w-4" />
                                Block
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 pt-6 border-t">
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => handleInteraction('like')}
                                className="gap-2"
                            >
                                <ThumbsUp className="h-4 w-4" />
                                {article.likes > 0
                                    ? `Like (${article.likes})`
                                    : 'Like'}
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => handleInteraction('dislike')}
                                className="gap-2"
                            >
                                <ThumbsDown className="h-4 w-4" />
                                {article.dislikes > 0
                                    ? `Dislike (${article.dislikes})`
                                    : 'Dislike'}
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => handleInteraction('block')}
                                className="gap-2 ml-auto"
                            >
                                <Ban className="h-4 w-4" />
                                Block
                            </Button>
                        </div>
                    )}
                </article>

                <LoginModal
                    open={showLoginModal}
                    onOpenChange={setShowLoginModal}
                    onSuccess={() => {
                        fetchArticle();
                        router.refresh();
                    }}
                />
            </main>
        </div>
    );
}
