'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Loader2, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

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
import { CATEGORIES } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Navigation } from '@/components/navigation';
import { uploadService } from '@/services/upload.service';
import { articleService } from '@/services/article.service';
import { RichTextEditor } from '@/components/rich-text-editor';

export default function EditArticlePage() {
    const router = useRouter();
    const params = useParams();
    const articleId = params.id as string;
    const { user, isLoading: authLoading } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        category: '',
        images: [] as string[],
        tags: [] as string[],
    });
    const [currentTag, setCurrentTag] = useState('');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const { data, error } = await articleService.getById(articleId);

                if (error || !data) {
                    toast({
                        title: 'Error',
                        description: error || 'Article not found',
                        variant: 'destructive',
                    });
                    return;
                }

                const article = data.data;

                console.log(data);

                setFormData({
                    title: article.title,
                    description: article.description,
                    content: article.content,
                    category: article.category,
                    images: article.images || [],
                    tags: article.tags || [],
                });
            } catch (error) {
                console.log('Failed to fetch article', error);
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

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        try {
            const file = files[0];

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: 'Error',
                    description: 'Image size must be less than 5MB',
                    variant: 'destructive',
                });
                return;
            }

            // Validate file type
            if (!file.type.match(/^image\/(jpg|jpeg|png|gif|webp)$/)) {
                toast({
                    title: 'Error',
                    description:
                        'Only image files (JPG, PNG, GIF, WebP) are allowed',
                    variant: 'destructive',
                });
                return;
            }

            const { url } = await uploadService.uploadImage(file);
            const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${url}`;

            setFormData({
                ...formData,
                images: [...formData.images, fullUrl],
            });

            toast({
                title: 'Success',
                description: 'Image uploaded successfully',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description:
                    (error as Error).message || 'Failed to upload image',
                variant: 'destructive',
            });
        } finally {
            setIsUploading(false);
            // Reset input
            e.target.value = '';
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
                                <RichTextEditor
                                    content={formData.content}
                                    onChange={(content: string) =>
                                        setFormData({ ...formData, content })
                                    }
                                    placeholder="Write your article content here..."
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
                                        onKeyUp={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addTag();
                                            }
                                        }}
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
                                <div className="flex flex-col gap-2">
                                    <Input
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                        onChange={handleImageUpload}
                                        disabled={isUploading}
                                        className="cursor-pointer"
                                    />
                                    {isUploading && (
                                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Uploading image...
                                        </p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Max file size: 5MB. Supported formats:
                                        JPG, PNG, GIF, WebP.{' '}
                                        <span className="font-semibold">
                                            First image will be used as the
                                            featured image.
                                        </span>
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                                    {formData.images.map((image, index) => (
                                        <div
                                            key={image}
                                            className="relative aspect-video rounded-lg overflow-hidden bg-muted"
                                        >
                                            {index === 0 && (
                                                <div className="absolute top-2 left-2 z-10">
                                                    <Badge
                                                        variant="default"
                                                        className="text-xs"
                                                    >
                                                        Featured
                                                    </Badge>
                                                </div>
                                            )}
                                            <Image
                                                src={
                                                    image || '/placeholder.svg'
                                                }
                                                width={100}
                                                height={100}
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
