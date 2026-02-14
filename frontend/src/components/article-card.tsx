'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Article } from '@/lib/types';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';

interface ArticleCardProps {
    article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/articles/${article.id}`);
    };

    return (
        <Card
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={handleClick}
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
                        <Badge key={tag} variant="outline" className="text-xs">
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
    );
}
