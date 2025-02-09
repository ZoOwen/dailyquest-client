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
    Employer: null; // Kalau ada data Employer, kamu bisa sesuaikan di sini
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

    const token = localStorage.getItem("token");

    // Fungsi untuk mengurai JWT dan mendapatkan ID pengguna
    function parseJwt(token: string | null): DecodedToken | null {
        if (!token) {
            return null; // Kembalikan null jika token tidak ada
        }
        const base64Url = token.split('.')[1]; // Ambil bagian payload dari JWT
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Decode base64 URL
        return JSON.parse(window.atob(base64)); // Parse payload menjadi objek
    }

    // Cek jika token ada dan valid
    const decodedToken = parseJwt(token);
    if (!decodedToken) {
        console.log("Token tidak valid atau tidak ada.");
        return null; // Jangan tampilkan JobCard jika token tidak ada atau tidak valid
    }

    const { id: userId } = decodedToken;

    // Fungsi untuk mengambil wallet berdasarkan user_id
    const fetchWallet = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/v1/wallet/${userId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 404) {
                console.warn("Wallet not found, setting wallet to null.");
                setWallet(null); // Biarkan wallet tetap null agar tombol Generate Wallet muncul
                return;
            }

            if (!response.ok) {
                throw new Error(`Failed to fetch wallet: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.success) {
                setWallet(data.data); // Update state dengan data wallet
            }
        } catch (error) {
            console.error("Error fetching wallet:", error);
            setWallet(null);
        }
    };

    // Fungsi untuk mengambil profil berdasarkan ID
    const fetchProfile = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                `http://localhost:5000/api/v1/auth/profile?profile_id=${userId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}` // Kirim token di header Authorization
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch profile: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.success) {
                setProfile(data.data); // Set profile dengan data yang didapatkan
            } else {
                setError("Failed to fetch profile");
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : "An error occurred while fetching the profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
        fetchWallet();
    }, [userId, token]);

    const generateWallet = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/v1/wallet`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Pastikan token ada di localStorage
                },
                body: JSON.stringify({
                    user_id: userId, // Kirim user_id sebagai data untuk wallet
                    balance: "0", // Saldo awal 0
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate wallet");
            }

            const data = await response.json();
            if (data.success) {
                // Wallet berhasil dibuat, ambil data wallet terbaru
                fetchWallet(); // Panggil fetchWallet untuk memperbarui state wallet
            } else {
                setError("Failed to generate wallet.");
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : "An error occurred while generating the wallet");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;
    if (!profile) return <div className="text-center">Profile not found</div>;

    return (
        <div className="bg-gray-100 font-roboto min-h-screen flex flex-col">
            <Header />

            {/* Main Profile Layout */}
            <div className="w-full h-full p-10 flex flex-row justify-between bg-white shadow-lg rounded-lg">
                {/* Left side with profile picture and basic info */}
                <div className="flex flex-col items-center w-1/4 p-4">
                    <img
                        src={`/images/${profile.Worker?.student_card_photo || "default-avatar.jpg"}`}
                        alt="Profile"
                        className="w-40 h-40 object-cover rounded-full border-4 border-gray-300 mb-4"
                    />
                    <h2 className="text-2xl font-semibold">{profile.Worker?.name || profile.username}</h2>
                    <p className="text-gray-500 text-center">{profile.Worker?.address || "No Address"}</p>
                    <div className="flex justify-center mt-6 space-x-4">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                            Edit
                        </button>
                        {/* <button className="bg-green-500 text-white px-4 py-2 rounded-md">
                            Message
                        </button> */}
                    </div>
                </div>

                {/* Right side with contact and project info */}
                <div className="w-3/4 p-4">
                    {/* Personal Info */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold">Personal Information</h2>
                        <div className="space-y-2">
                            <p><strong>Username:</strong> {profile.username}</p>
                            <p><strong>Email:</strong> {profile.email}</p>
                            <p><strong>Phone:</strong> {profile.phone}</p>
                        </div>
                    </div>

                    {/* Wallet Info */}
                    {wallet ? (
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold">Wallet Information</h2>
                            <div className="space-y-2">
                                <p><strong>Balance:</strong> {wallet.balance}</p>
                                {/* <p><strong>Wallet ID:</strong> {wallet.id}</p> */}
                                <p><strong>Created At:</strong> {new Date(wallet.createdAt).toLocaleString()}</p>
                                <p><strong>Updated At:</strong> {new Date(wallet.updatedAt).toLocaleString()}</p>
                            </div>

                            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                                Withdraw
                            </button>
                        </div>
                    ) : (
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold">Wallet Information</h2>
                            <p className="text-gray-500">No wallet found</p>
                            <button
                                onClick={generateWallet}
                                className="bg-blue-600 text-white px-6 py-2 rounded-md mt-4"
                                disabled={loading}
                            >
                                {loading ? "Generating..." : "Generate Wallet"}
                            </button>
                        </div>
                    )}

                    {/* Project Progress */}
                    {/* <div className="mt-8">
                        <h2 className="text-2xl font-semibold">Project Status</h2>
                        <div className="space-y-4">
                            <div className="mb-2">
                                <p>Web Design</p>
                                <div className="w-full bg-gray-300 h-2 rounded-full">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                                </div>
                            </div>
                            <div className="mb-2">
                                <p>Mobile Template</p>
                                <div className="w-full bg-gray-300 h-2 rounded-full">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "40%" }}></div>
                                </div>
                            </div>
                            <div className="mb-2">
                                <p>Backend API</p>
                                <div className="w-full bg-gray-300 h-2 rounded-full">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "80%" }}></div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>

            <Footer />
        </div>
    );
}