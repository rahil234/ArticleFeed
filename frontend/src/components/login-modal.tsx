'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface LoginModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function LoginModal({ open, onOpenChange, onSuccess }: LoginModalProps) {
    const router = useRouter();
    const { toast } = useToast();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        emailOrPhone: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await login(formData.emailOrPhone, formData.password);

            toast({
                title: 'Success',
                description: 'Logged in successfully!',
            });

            // Close modal and refresh
            onOpenChange(false);
            if (onSuccess) {
                onSuccess();
            } else {
                router.refresh();
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: (error as Error).message || 'Invalid credentials',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                        Welcome Back
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Login to access your account
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="emailOrPhone">Email or Phone</Label>
                        <Input
                            id="emailOrPhone"
                            type="text"
                            placeholder="john@example.com or +1234567890"
                            required
                            value={formData.emailOrPhone}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    emailOrPhone: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    password: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full"
                        >
                            {isLoading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Sign In
                        </Button>
                        <div className="text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{' '}
                            <Link
                                href="/register"
                                className="text-primary underline hover:no-underline"
                                onClick={() => onOpenChange(false)}
                            >
                                Sign up
                            </Link>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
