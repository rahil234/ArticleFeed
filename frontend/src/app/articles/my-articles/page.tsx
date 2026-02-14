'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import type { Article } from '@/lib/types';
import { articleService } from '@/services/article.service';
import { useToast } from '@/hooks/use-toast';
import {
    Loader2,
    Edit,
    Trash2,
    ThumbsUp,
    ThumbsDown,
    Ban,
    Upload,
    FileX,
} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function MyArticlesPage() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const { toast } = useToast();
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [publishingId, setPublishingId] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    const fetchArticles = useCallback(async () => {
        try {
            const { data, error } = await articleService.getUserArticles();

            if (error) {
                toast({
                    title: 'Error',
                    description: error || 'Failed to fetch articles',
                    variant: 'destructive',
                });
                return;
            }

            if (!data) {
                setArticles([]);
                return;
            }

            setArticles(data.data || []);
        } catch (error) {
            console.error('Failed to fetch articles:', error);
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        if (user) {
            fetchArticles();
        }
    }, [fetchArticles, user]);

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            await articleService.delete(deleteId);
            toast({
                title: 'Success',
                description: 'Article deleted successfully',
            });
            fetchArticles();
        } catch (error) {
            toast({
                title: 'Error',
                description:
                    (error as Error).message || 'Failed to delete article',
                variant: 'destructive',
            });
        } finally {
            setDeleteId(null);
        }
    };

    const handlePublish = async (id: string) => {
        setPublishingId(id);
        try {
            const { error } = await articleService.publish(id);
            if (error) {
                toast({
                    title: 'Error',
                    description: error || 'Failed to publish article',
                    variant: 'destructive',
                });
                return;
            }
            toast({
                title: 'Success',
                description: 'Article published successfully',
            });
            fetchArticles();
        } catch (error) {
            toast({
                title: 'Error',
                description:
                    (error as Error).message || 'Failed to publish article',
                variant: 'destructive',
            });
        } finally {
            setPublishingId(null);
        }
    };

    const handleUnpublish = async (id: string) => {
        setPublishingId(id);
        try {
            const { error } = await articleService.unpublish(id);
            if (error) {
                toast({
                    title: 'Error',
                    description: error || 'Failed to unpublish article',
                    variant: 'destructive',
                });
                return;
            }
            toast({
                title: 'Success',
                description: 'Article unpublished successfully',
            });
            fetchArticles();
        } catch (error) {
            toast({
                title: 'Error',
                description:
                    (error as Error).message || 'Failed to unpublish article',
                variant: 'destructive',
            });
        } finally {
            setPublishingId(null);
        }
    };

    if (authLoading || !user) {
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
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold">My Articles</h1>
                    {articles.length !== 0 && (
                        <Button asChild>
                            <Link href="/articles/create">
                                Create New Article
                            </Link>
                        </Button>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : articles.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">
                            You haven&#39;t created any articles yet.
                        </p>
                        <Button asChild>
                            <Link href="/articles/create">
                                Create Your First Article
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article) => (
                            <Card key={article.id} className="overflow-hidden">
                                {article.images?.[0] && (
                                    <div className="aspect-video w-full overflow-hidden bg-muted">
                                        <Image
                                            src={
                                                article.images[0] ||
                                                '/placeholder.svg'
                                            }
                                            width={100}
                                            height={100}
                                            alt={article.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                )}
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-4">
                                        <h3 className="text-xl font-semibold leading-tight text-balance">
                                            {article.title}
                                        </h3>
                                        <div className="flex flex-col gap-2 items-end">
                                            <Badge variant="secondary">
                                                {article.category}
                                            </Badge>
                                            <Badge
                                                variant={
                                                    article.status ===
                                                    'PUBLISHED'
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                className={
                                                    article.status ===
                                                    'PUBLISHED'
                                                        ? 'bg-green-500 hover:bg-green-600'
                                                        : ''
                                                }
                                            >
                                                {article.status === 'PUBLISHED'
                                                    ? '✓ Published'
                                                    : '○ Draft'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {article.description}
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <ThumbsUp className="h-4 w-4" />
                                            <span>{article.likes}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <ThumbsDown className="h-4 w-4" />
                                            <span>{article.dislikes}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Ban className="h-4 w-4" />
                                            <span>{article.blocks}</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col gap-2">
                                    <div className="flex gap-2 w-full">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 bg-transparent"
                                            asChild
                                        >
                                            <Link
                                                href={`/articles/edit/${article.id}`}
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() =>
                                                setDeleteId(article.id)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </Button>
                                    </div>
                                    <Button
                                        variant={
                                            article.status === 'PUBLISHED'
                                                ? 'outline'
                                                : 'default'
                                        }
                                        size="sm"
                                        className="w-full"
                                        onClick={() =>
                                            article.status === 'PUBLISHED'
                                                ? handleUnpublish(article.id)
                                                : handlePublish(article.id)
                                        }
                                        disabled={publishingId === article.id}
                                    >
                                        {publishingId === article.id ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : article.status === 'PUBLISHED' ? (
                                            <FileX className="h-4 w-4 mr-2" />
                                        ) : (
                                            <Upload className="h-4 w-4 mr-2" />
                                        )}
                                        {article.status === 'PUBLISHED'
                                            ? 'Unpublish'
                                            : 'Publish'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            <AlertDialog
                open={!!deleteId}
                onOpenChange={() => setDeleteId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your article.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
