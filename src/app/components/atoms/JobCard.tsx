"use client";

import { useState } from "react";
import Link from "next/link";

interface Job {
    id: number;
    title: string;
    category: string;
    location: string;
    salary: string;
    status: string
}

interface JobCardProps {
    job: Job;
}

interface DecodedToken {
    id: number;
    username: string;
    role: number;
    iat: number;
    exp: number;
}

export default function JobCard({ job }: JobCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal konfirmasi
    const [isNotificationOpen, setIsNotificationOpen] = useState(false); // Modal notifikasi berhasil
    const [isLoading, setIsLoading] = useState(false); // Untuk loading saat melamar pekerjaan

    const token = localStorage.getItem("token"); // Ambil token dari localStorage
    console.log("raw", token);

    // Fungsi untuk mem-parse JWT
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
    console.log("olahan id", decodedToken.id);
    console.log("ini worker Id", userId);

    // Fungsi untuk menangani klik "Gabung Instant" (hanya membuka modal)
    const handleOpenModal = () => {
        if (!userId) {
            alert("Anda harus login terlebih dahulu untuk melamar pekerjaan.");
            return;
        }
        setIsModalOpen(true); // Tampilkan modal konfirmasi
    };

    // Fungsi untuk menangani konfirmasi lamaran pekerjaan (setelah klik "Ya")
    const handleApply = async () => {
        setIsModalOpen(false); // Menutup modal konfirmasi
        try {
            setIsLoading(true);
            const response = await fetch("http://localhost:5000/api/v1/application/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    job_id: job.id,
                    user_id: userId,
                    application_date: new Date().toISOString(),
                    status: "Pending",
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to apply for the job");
            }

            // Tampilkan modal notifikasi sukses
            setIsNotificationOpen(true);

        } catch (error) {
            alert(error + "Terjadi kesalahan saat mengirim lamaran. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {job.status !== 'Closed' && (
                <div>
                    <div className="bg-white shadow rounded-lg p-4">
                        <h4 className="font-bold text-lg text-gray-600">{job.title}</h4>
                        <p className="text-gray-900">{job.category}</p>
                        <p className="mt-2 text-sm text-gray-600">Location: {job.location}</p>
                        <p className="mt-2 text-sm text-gray-600">Salary: {job.salary}</p>
                        <div className="flex space-x-2 mt-4">
                            <Link
                                href={`/jobs/${job.id}`}
                                className="inline-block bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                            >
                                Lihat Detail
                            </Link>

                            {/* Tombol "Gabung Instant" */}
                            <button
                                onClick={handleOpenModal}
                                className="inline-block bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                            >
                                {isLoading ? "Loading..." : "Gabung Instant"}
                            </button>
                        </div>

                        {/* Modal Konfirmasi */}
                        {isModalOpen && (
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                                <div className="bg-white p-6 rounded-lg shadow-lg">
                                    <h3 className="text-xl mb-4">Apakah anda ingin mencoba melamar pekerjaan ini?</h3>
                                    <div className="flex justify-between">
                                        <button
                                            onClick={() => setIsModalOpen(false)} // Menutup modal konfirmasi jika "Tidak"
                                            className="px-4 py-2 bg-gray-300 rounded-md"
                                        >
                                            Tidak
                                        </button>
                                        <button
                                            onClick={handleApply} // Menangani pengiriman lamaran jika "Ya"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md"
                                        >
                                            Ya
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Modal Notifikasi Sukses */}
                        {isNotificationOpen && (
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                                <div className="bg-white p-6 rounded-lg shadow-lg">
                                    <h3 className="text-xl mb-4">Lamaran berhasil dikirim!</h3>
                                    <button
                                        onClick={() => setIsNotificationOpen(false)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md"
                                    >
                                        OK
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}
