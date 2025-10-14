'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Article } from '@/lib/types';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, Ban, Calendar, User } from 'lucide-react';
import { articleService } from '@/services/article.service';
import { useToast } from '@/hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface ArticleCardProps {
    article: Article;
    onInteraction?: () => void;
}

export function ArticleCard({ article, onInteraction }: ArticleCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isInteracting, setIsInteracting] = useState(false);
    const { toast } = useToast();

    const handleInteraction = async (type: 'like' | 'dislike' | 'block') => {
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
            onInteraction?.();
            if (type === 'block') {
                setIsOpen(false);
            }
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

    return (
        <>
            <Card
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setIsOpen(true)}
            >
                {article.images?.[0] && (
                    <div className="aspect-video w-full overflow-hidden bg-muted">
                        <Image
                            src={article.images[0] || '/placeholder.svg'}
                            width={100}
                            height={100}
                            alt={article.title}
                            className="h-full w-full object-cover"
                        />
                    </div>
                )}
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold leading-tight text-balance">
                                {article.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                {article.description}
                            </p>
                        </div>
                        <Badge variant="secondary">{article.category}</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {article.tags.slice(0, 3).map((tag) => (
                            <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{article.authorName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                            {new Date(article.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </CardFooter>
            </Card>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl text-balance">
                            {article.title}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {article.images?.[0] && (
                            <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                                <Image
                                    src={
                                        article.images[0] || '/placeholder.svg'
                                    }
                                    width={100}
                                    height={100}
                                    alt={article.title}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        )}

                        <div className="flex items-center justify-between">
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

                        <div className="prose prose-sm max-w-none">
                            <p className="text-muted-foreground leading-relaxed">
                                {article.content}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {article.tags.map((tag) => (
                                <Badge key={tag} variant="outline">
                                    {tag}
                                </Badge>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 pt-4 border-t">
                            <Button
                                variant={
                                    article.isLiked ? 'default' : 'outline'
                                }
                                size="sm"
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
                                size="sm"
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
                                size="sm"
                                onClick={() => handleInteraction('block')}
                                disabled={isInteracting}
                                className="gap-2 ml-auto"
                            >
                                <Ban className="h-4 w-4" />
                                Block
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
