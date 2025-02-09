"use client";

import { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

interface Worker {
    name: string;
    address: string;
    gender: string;
    city: string;
    province: string;
    student_card_photo: string;
}

interface ProfileData {
    id: number;
    username: string;
    email: string;
    phone: string;
    role: number;
    Worker: Worker | null;
    Employer: null;
}

interface DecodedToken {
    id: number;
    username: string;
    role: number;
    iat: number;
    exp: number;
}

interface Wallet {
    id: number;
    user_id: number;
    balance: string;
    createdAt: string;
    updatedAt: string;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

    const parseJwt = (token: string | null): DecodedToken | null => {
        try {
            if (!token) return null;
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(window.atob(base64));
        } catch (error) {
            console.error('Error parsing JWT:', error);
            return null;
        }
    };

    const decodedToken = parseJwt(token);
    const userId = decodedToken?.id;

    const fetchWallet = async () => {
        if (!userId || !token) return;

        try {
            const response = await fetch(
                `http://localhost:5000/api/v1/wallet/${userId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 404) {
                setWallet(null);
                return;
            }

            if (!response.ok) {
                throw new Error(`Failed to fetch wallet: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.success) {
                setWallet(data.data);
            }
        } catch (error) {
            console.error("Error fetching wallet:", error);
            setWallet(null);
        }
    };

    const fetchProfile = async () => {
        if (!userId || !token) return;

        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:5000/api/v1/auth/profile?profile_id=${userId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch profile: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.success) {
                setProfile(data.data);
            } else {
                setError("Failed to fetch profile");
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const generateWallet = async () => {
        if (!userId || !token) return;

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/v1/wallet`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    user_id: userId,
                    balance: "0",
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate wallet");
            }

            const data = await response.json();
            if (data.success) {
                await fetchWallet();
            } else {
                setError("Failed to generate wallet");
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId && token) {
            fetchProfile();
            fetchWallet();
        }
    }, [userId, token]);

    if (!token || !decodedToken) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-semibold">Please log in to view your profile</h1>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg">Profile not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Header />

            <main className="flex-1 container mx-auto py-8">
                <div className="bg-white rounded-lg shadow-lg">
                    <div className="grid md:grid-cols-4 gap-8 p-6">
                        {/* Profile Section */}
                        <div className="md:col-span-1 flex flex-col items-center space-y-4">
                            <img
                                src={`/images/${profile.Worker?.student_card_photo || "default-avatar.jpg"}`}
                                alt="Profile"
                                className="w-40 h-40 rounded-full object-cover border-4 border-gray-200"
                            />
                            <h2 className="text-2xl font-semibold text-center">
                                {profile.Worker?.name || profile.username}
                            </h2>
                            <p className="text-gray-500 text-center">
                                {profile.Worker?.address || "No Address"}
                            </p>
                            <button className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                                Edit Profile
                            </button>
                        </div>

                        {/* Details Section */}
                        <div className="md:col-span-3 space-y-8">
                            <section>
                                <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                                <div className="space-y-2">
                                    <p><span className="font-medium">Username:</span> {profile.username}</p>
                                    <p><span className="font-medium">Email:</span> {profile.email}</p>
                                    <p><span className="font-medium">Phone:</span> {profile.phone}</p>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold mb-4">Wallet Information</h3>
                                {wallet ? (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <p><span className="font-medium">Balance:</span> ${wallet.balance}</p>
                                            <p><span className="font-medium">Created:</span> {new Date(wallet.createdAt).toLocaleDateString()}</p>
                                            <p><span className="font-medium">Last Updated:</span> {new Date(wallet.updatedAt).toLocaleDateString()}</p>
                                        </div>
                                        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                                            Withdraw Funds
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-gray-500">No wallet found</p>
                                        <button
                                            onClick={generateWallet}
                                            disabled={loading}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <span className="flex items-center">
                                                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                                                    Generating...
                                                </span>
                                            ) : (
                                                "Generate Wallet"
                                            )}
                                        </button>
                                    </div>
                                )}
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
