'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/lib/auth-context';
import { CATEGORIES } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { userService } from '@/services/user.service';

export default function SettingsPage() {
    const router = useRouter();
    const { user, isLoading: authLoading, refreshUser } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dob: '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [preferences, setPreferences] = useState<string[]>([]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
        } else if (user) {
            setProfileData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                dob: user.dob,
            });
            setPreferences(user.preferences);
        }
    }, [user, authLoading, router]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { error } = await userService.updateProfile(profileData);

            if (error) {
                toast({
                    title: 'Error',
                    description: error || 'Failed to update profile',
                    variant: 'destructive',
                });
                return;
            }

            await refreshUser();
            toast({
                title: 'Success',
                description: 'Profile updated successfully',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description:
                    (error as Error).message || 'Failed to update profile',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast({
                title: 'Error',
                description: 'Passwords do not match',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);
        try {
            await userService.updatePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            toast({
                title: 'Success',
                description: 'Password updated successfully',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description:
                    (error as Error).message || 'Failed to update password',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePreferencesUpdate = async () => {
        if (preferences.length === 0) {
            toast({
                title: 'Error',
                description: 'Please select at least one preference',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);
        try {
            await userService.updatePreferences(preferences);
            await refreshUser();
            toast({
                title: 'Success',
                description: 'Preferences updated successfully',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description:
                    (error as Error).message || 'Failed to update preferences',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const togglePreference = (category: string) => {
        setPreferences((prev) =>
            prev.includes(category)
                ? prev.filter((p) => p !== category)
                : [...prev, category],
        );
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
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Settings</h1>

                <div className="space-y-6">
                    {/* Profile Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Update your personal details
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={handleProfileUpdate}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">
                                            First Name
                                        </Label>
                                        <Input
                                            id="firstName"
                                            value={profileData.firstName}
                                            onChange={(e) =>
                                                setProfileData({
                                                    ...profileData,
                                                    firstName: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">
                                            Last Name
                                        </Label>
                                        <Input
                                            id="lastName"
                                            value={profileData.lastName}
                                            onChange={(e) =>
                                                setProfileData({
                                                    ...profileData,
                                                    lastName: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) =>
                                            setProfileData({
                                                ...profileData,
                                                email: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={(e) =>
                                            setProfileData({
                                                ...profileData,
                                                phone: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dob">Date of Birth</Label>
                                    <Input
                                        id="dob"
                                        type="date"
                                        value={profileData.dob}
                                        onChange={(e) =>
                                            setProfileData({
                                                ...profileData,
                                                dob: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <Button type="submit" disabled={isLoading}>
                                    {isLoading && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Update Profile
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Password Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>
                                Update your account password
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={handlePasswordUpdate}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">
                                        Current Password
                                    </Label>
                                    <Input
                                        id="currentPassword"
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                currentPassword: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">
                                        New Password
                                    </Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                newPassword: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">
                                        Confirm New Password
                                    </Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                confirmPassword: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <Button type="submit" disabled={isLoading}>
                                    {isLoading && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Update Password
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Preferences Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Article Preferences</CardTitle>
                            <CardDescription>
                                Choose the categories you&#39;re interested in
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {CATEGORIES.map((category) => (
                                    <div
                                        key={category}
                                        className="flex items-center space-x-2"
                                    >
                                        <Checkbox
                                            id={`pref-${category}`}
                                            checked={preferences.includes(
                                                category,
                                            )}
                                            onCheckedChange={() =>
                                                togglePreference(category)
                                            }
                                        />
                                        <label
                                            htmlFor={`pref-${category}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            {category}
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <Button
                                onClick={handlePreferencesUpdate}
                                disabled={isLoading}
                            >
                                {isLoading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Update Preferences
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
