'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/lib/auth-context';
import { articleService } from '@/services/article.service';
import { CATEGORIES } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function EditArticlePage() {
    const router = useRouter();
    const params = useParams();
    const articleId = params.id as string;
    const { user, isLoading: authLoading } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        category: '',
        images: [] as string[],
        tags: [] as string[],
    });
    const [currentTag, setCurrentTag] = useState('');
    const [currentImage, setCurrentImage] = useState('');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const { data, error } = await articleService.getById(articleId);

                if (error || !data) {
                    throw new Error(error);
                }

                const article = data.data;

                setFormData({
                    title: article.title,
                    description: article.description,
                    content: article.content,
                    category: article.category,
                    images: article.images || [],
                    tags: article.tags || [],
                });
            } catch {
                toast({
                    title: 'Error',
                    description: 'Failed to load article',
                    variant: 'destructive',
                });
                router.push('/articles/my-articles');
            } finally {
                setIsLoading(false);
            }
        };

        if (user && articleId) {
            fetchArticle();
        }
    }, [user, articleId, router, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.category) {
            toast({
                title: 'Error',
                description: 'Please select a category',
                variant: 'destructive',
            });
            return;
        }

        setIsSaving(true);
        try {
            await articleService.update(articleId, formData);
            toast({
                title: 'Success',
                description: 'Article updated successfully!',
            });
            router.push('/articles/my-articles');
        } catch (error) {
            toast({
                title: 'Error',
                description:
                    (error as Error).message || 'Failed to update article',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };

    const addTag = () => {
        if (currentTag && !formData.tags.includes(currentTag)) {
            setFormData({ ...formData, tags: [...formData.tags, currentTag] });
            setCurrentTag('');
        }
    };

    const removeTag = (tag: string) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter((t) => t !== tag),
        });
    };

    const addImage = () => {
        if (currentImage && !formData.images.includes(currentImage)) {
            setFormData({
                ...formData,
                images: [...formData.images, currentImage],
            });
            setCurrentImage('');
        }
    };

    const removeImage = (image: string) => {
        setFormData({
            ...formData,
            images: formData.images.filter((i) => i !== image),
        });
    };

    if (authLoading || !user || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Edit Article</h1>

                <Card>
                    <CardHeader>
                        <CardTitle>Update Article</CardTitle>
                        <CardDescription>
                            Make changes to your article
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    required
                                    placeholder="Enter article title"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    required
                                    placeholder="Brief description of your article"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Content</Label>
                                <Textarea
                                    id="content"
                                    required
                                    placeholder="Write your article content here..."
                                    value={formData.content}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            content: e.target.value,
                                        })
                                    }
                                    rows={10}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            category: value,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map((category) => (
                                            <SelectItem
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Tags</Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add a tag"
                                        value={currentTag}
                                        onChange={(e) =>
                                            setCurrentTag(e.target.value)
                                        }
                                        onKeyUp={(e) =>
                                            e.key === 'Enter' &&
                                            (e.preventDefault(), addTag())
                                        }
                                    />
                                    <Button
                                        type="button"
                                        onClick={addTag}
                                        variant="secondary"
                                    >
                                        Add
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.tags.map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="gap-1"
                                        >
                                            {tag}
                                            <X
                                                className="h-3 w-3 cursor-pointer"
                                                onClick={() => removeTag(tag)}
                                            />
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Images</Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add image URL"
                                        value={currentImage}
                                        onChange={(e) =>
                                            setCurrentImage(e.target.value)
                                        }
                                        onKeyUp={(e) =>
                                            e.key === 'Enter' &&
                                            (e.preventDefault(), addImage())
                                        }
                                    />
                                    <Button
                                        type="button"
                                        onClick={addImage}
                                        variant="secondary"
                                    >
                                        Add
                                    </Button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                                    {formData.images.map((image) => (
                                        <div
                                            key={image}
                                            className="relative aspect-video rounded-lg overflow-hidden bg-muted"
                                        >
                                            <Image
                                                src={
                                                    image || '/placeholder.svg'
                                                }
                                                alt="Article"
                                                className="h-full w-full object-cover"
                                            />
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="destructive"
                                                className="absolute top-2 right-2 h-6 w-6"
                                                onClick={() =>
                                                    removeImage(image)
                                                }
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={isSaving}>
                                    {isSaving && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Update Article
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
