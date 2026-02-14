'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    Bold,
    Code,
    Heading1,
    Heading2,
    Heading3,
    ImageIcon,
    Italic,
    Link2,
    List,
    ListOrdered,
    Loader2,
    Quote,
    Redo,
    Strikethrough,
    Underline as UnderlineIcon,
    Undo,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { uploadService } from '@/services/upload.service';
import { useToast } from '@/hooks/use-toast';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

export function RichTextEditor({
    content,
    onChange,
    placeholder = 'Write your article content here...',
}: RichTextEditorProps) {
    const { toast } = useToast();
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Underline,
            Placeholder.configure({
                placeholder,
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[300px] p-4',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    const setLink = useCallback(() => {
        if (!editor) return;

        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: url })
            .run();
    }, [editor]);

    const addImage = useCallback(() => {
        if (!editor) return;
        // Trigger file input click
        fileInputRef.current?.click();
    }, [editor]);

    const handleImageUpload = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (!files || files.length === 0 || !editor) return;

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

            setIsUploadingImage(true);
            try {
                const { url } = await uploadService.uploadImage(file);
                const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${url}`;

                // Insert image into editor
                editor.chain().focus().setImage({ src: fullUrl }).run();

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
                setIsUploadingImage(false);
                // Reset input
                e.target.value = '';
            }
        },
        [editor, toast],
    );

    if (!editor) {
        return null;
    }

    return (
        <div className="border rounded-lg overflow-hidden bg-background">
            <div className="border-b bg-muted/50 p-2 flex flex-wrap gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'bg-muted' : ''}
                    title="Bold"
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'bg-muted' : ''}
                    title="Italic"
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleUnderline().run()
                    }
                    className={editor.isActive('underline') ? 'bg-muted' : ''}
                    title="Underline"
                >
                    <UnderlineIcon className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={editor.isActive('strike') ? 'bg-muted' : ''}
                    title="Strikethrough"
                >
                    <Strikethrough className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={editor.isActive('code') ? 'bg-muted' : ''}
                    title="Code"
                >
                    <Code className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-border mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    className={
                        editor.isActive('heading', { level: 1 })
                            ? 'bg-muted'
                            : ''
                    }
                    title="Heading 1"
                >
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className={
                        editor.isActive('heading', { level: 2 })
                            ? 'bg-muted'
                            : ''
                    }
                    title="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    className={
                        editor.isActive('heading', { level: 3 })
                            ? 'bg-muted'
                            : ''
                    }
                    title="Heading 3"
                >
                    <Heading3 className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-border mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    className={editor.isActive('bulletList') ? 'bg-muted' : ''}
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    className={editor.isActive('orderedList') ? 'bg-muted' : ''}
                    title="Numbered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                    className={editor.isActive('blockquote') ? 'bg-muted' : ''}
                    title="Quote"
                >
                    <Quote className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-border mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().setTextAlign('left').run()
                    }
                    className={
                        editor.isActive({ textAlign: 'left' }) ? 'bg-muted' : ''
                    }
                    title="Align Left"
                >
                    <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().setTextAlign('center').run()
                    }
                    className={
                        editor.isActive({ textAlign: 'center' })
                            ? 'bg-muted'
                            : ''
                    }
                    title="Align Center"
                >
                    <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().setTextAlign('right').run()
                    }
                    className={
                        editor.isActive({ textAlign: 'right' })
                            ? 'bg-muted'
                            : ''
                    }
                    title="Align Right"
                >
                    <AlignRight className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().setTextAlign('justify').run()
                    }
                    className={
                        editor.isActive({ textAlign: 'justify' })
                            ? 'bg-muted'
                            : ''
                    }
                    title="Justify"
                >
                    <AlignJustify className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-border mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={setLink}
                    className={editor.isActive('link') ? 'bg-muted' : ''}
                    title="Add Link"
                >
                    <Link2 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addImage}
                    disabled={isUploadingImage}
                    title="Upload Image"
                >
                    {isUploadingImage ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <ImageIcon className="h-4 w-4" />
                    )}
                </Button>

                <div className="w-px h-6 bg-border mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Undo"
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Redo"
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>
            <EditorContent editor={editor} />
            {/* Hidden file input for image upload */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleImageUpload}
                className="hidden"
            />
        </div>
    );
}
