"use client";

import { useEffect, useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

// Definisikan tipe data untuk aplikasi pekerjaan
interface Application {
    id: number;
    job_id: number;
    user_id: number;
    application_date: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    Job: {
        id: number;
        title: string;
        employer_id: number;
    };
}

// Definisikan tipe data untuk payload JWT
interface DecodedToken {
    id: number;
    username: string;
    // Tambahkan field lain jika diperlukan
}

export default function ApplicationHistoryPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    // Fungsi untuk mem-parse JWT
    function parseJwt(token: string | null): DecodedToken | null {
        if (!token) {
            return null; // Kembalikan null jika token tidak ada
        }
        try {
            const base64Url = token.split('.')[1]; // Ambil bagian payload dari JWT
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Decode base64 URL
            return JSON.parse(window.atob(base64)); // Parse payload menjadi objek
        } catch (err) {
            console.error("Error parsing JWT:", err);
            return null;
        }
    }

    useEffect(() => {
        // Pastikan kode ini hanya berjalan di client side
        // Ambil token dari localStorage hanya di client side
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
    }, []);

    useEffect(() => {
        // Fetch data hanya jika token tersedia
        if (!token) {
            setLoading(false);
            return;
        }

        // Parse token untuk mendapatkan user_id
        const decodedToken = parseJwt(token);

        if (!decodedToken) {
            setError("Invalid token. Please log in again.");
            setLoading(false);
            return;
        }
        console.log("flish id muncul", decodedToken.id)
        // Fetch data aplikasi pekerjaan
        const fetchApplicationHistory = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/v1/application?user_id=${decodedToken.id}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch application history: ${response.statusText}`);
                }
                const data = await response.json();
                setApplications(data.data); // Simpan data aplikasi
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchApplicationHistory();
    }, [token]);

    // Tampilkan loading state
    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    // Tampilkan error message
    if (error) {
        return (
            <div className="bg-gray-100 font-roboto min-h-screen flex flex-col">
                <Header />
                <div className="flex flex-col items-center justify-center flex-grow p-6">
                    <h1 className="text-2xl font-bold mb-6">Application History</h1>
                    <p className="text-red-500">{error}</p>
                </div>
                <Footer />
            </div>
        );
    }

    // Tampilkan data aplikasi
    return (
        <div className="bg-gray-100 font-roboto min-h-screen flex flex-col">
            <Header />
            <div className="flex flex-col items-center justify-center flex-grow p-6">
                <h1 className="text-2xl font-bold mb-6">Application History</h1>
                {applications.length === 0 ? (
                    <p className="text-gray-600">No applications found.</p>
                ) : (
                    <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="px-4 py-2">Job Title</th>
                                    <th className="px-4 py-2">Application Date</th>
                                    <th className="px-4 py-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map((app) => (
                                    <tr key={app.id} className="border-b">
                                        <td className="px-4 py-2 text-center">{app.Job.title}</td>
                                        <td className="px-4 py-2 text-center">
                                            {new Date(app.application_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-2 text-center">{app.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
