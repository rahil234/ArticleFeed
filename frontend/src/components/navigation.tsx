'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FileText, Home, LogIn, LogOut, Menu, Settings } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { LoginModal } from '@/components/login-modal';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Navigation() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const navLinks = user
        ? [
              { href: '/dashboard', label: 'Dashboard', icon: Home },
              {
                  href: '/articles/my-articles',
                  label: 'My Articles',
                  icon: FileText,
              },
          ]
        : [{ href: '/', label: 'Home', icon: Home }];

    const NavLinks = () => (
        <>
            {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            pathname === link.href
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                    >
                        <Icon className="h-4 w-4" />
                        <span>{link.label}</span>
                    </Link>
                );
            })}
        </>
    );

    return (
        <nav className="border-b border-border bg-card">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link
                            href={user ? '/dashboard' : '/'}
                            className="text-xl font-bold text-primary"
                        >
                            ArticleFeeds
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-2">
                            <NavLinks />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Mobile Navigation */}
                        <Sheet>
                            <SheetTrigger asChild className="md:hidden">
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <div className="flex flex-col gap-4 mt-8">
                                    <NavLinks />
                                    {!user && (
                                        <>
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start"
                                                onClick={() =>
                                                    setShowLoginModal(true)
                                                }
                                            >
                                                <LogIn className="mr-2 h-4 w-4" />
                                                Login
                                            </Button>
                                            <Link href="/register">
                                                <Button className="w-full">
                                                    Sign Up
                                                </Button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>

                        {/* Public User Actions */}
                        {!user && (
                            <div className="hidden md:flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    onClick={() => setShowLoginModal(true)}
                                >
                                    <LogIn className="mr-2 h-4 w-4" />
                                    Login
                                </Button>
                                <Link href="/register">
                                    <Button>Sign Up</Button>
                                </Link>
                            </div>
                        )}

                        {/* User Menu */}
                        {user && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="relative h-10 w-10 rounded-full"
                                    >
                                        <Avatar>
                                            <AvatarFallback className="bg-primary text-primary-foreground">
                                                {user.firstName[0]}
                                                {user.lastName[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-56"
                                >
                                    <div className="flex flex-col gap-1 p-2">
                                        <p className="text-sm font-medium">
                                            {user.firstName} {user.lastName}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/settings"
                                            className="cursor-pointer"
                                        >
                                            <Settings className="mr-2 h-4 w-4" />
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="cursor-pointer text-destructive"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            </div>

            <LoginModal
                open={showLoginModal}
                onOpenChange={setShowLoginModal}
                onSuccess={() => {
                    router.push('/dashboard');
                    router.refresh();
                }}
            />
        </nav>
    );
}
