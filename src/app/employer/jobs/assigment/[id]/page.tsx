"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import SidebarEmployer from "../../../../components/layout/SidebarEmployer";
import HeaderEmployer from "../../../../components/layout/HeaderEmployer";
import '../../../../dashboard.css';

interface JobAssignment {
    id: number;
    job_application_id: number;
    job_id: number;
    assigned_at: string;
    completed_at: string | null;
    status: string;
    rating: number | null;
    review: string | null;
    JobApplication: {
        id: number;
        status: string;
        user_id: number;
        job_id: number;
        Job: {
            id: number;
            title: string;
            description: string;
            salary: string;
            location: string;
        };
    };
}

const JobAssignmentPage = () => {
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [assignment, setAssignment] = useState<JobAssignment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();
    const params = useParams();
    const id = params.id; // ID dari job assignment

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, []);

    // Fetch job assignment berdasarkan ID
    useEffect(() => {
        if (id) {
            const fetchAssignment = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/v1/job-assigment/${id}`);
                    const data = await response.json();
                    console.log("Job Assignment Data:", data);

                    if (data.success) {
                        setAssignment(data.data);
                    } else {
                        setError("Job assignment tidak ditemukan");
                    }
                } catch (error) {
                    console.error("Error fetching job assignment:", error);
                    setError("Terjadi kesalahan dalam mengambil data");
                } finally {
                    setLoading(false);
                }
            };

            fetchAssignment();
        }
    }, [id]);

    // Fungsi untuk menandai assignment sebagai selesai
    // Fungsi untuk menandai assignment selesai DAN melakukan pembayaran
    const markAsComplete = async () => {
        if (!assignment) return;

        try {
            // **1. Update Status Job Assignment ke "Completed"**
            const assignmentResponse = await fetch("http://localhost:5000/api/v1/job-assigment", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: assignment.id, // ID dari assignment
                    status: "Completed",
                }),
            });

            const assignmentData = await assignmentResponse.json();
            console.log("Assignment Response:", assignmentData);

            if (!assignmentData.success) {
                alert("Gagal menyelesaikan pekerjaan. Coba lagi.");
                return;
            }

            // **2. Lakukan Pembayaran**
            const paymentPayload = {
                job_id: assignment.job_id,
                worker_id: assignment.JobApplication.user_id, // ID pekerja dari JobApplication
                amount: parseInt(assignment.JobApplication.Job.salary), // Ambil gaji dari job
                transaction_type: "Payment",
                wallet_id: 1, // Wallet ID (bisa diambil dari API lain atau hardcoded sementara)
            };

            const paymentResponse = await fetch("http://localhost:5000/api/v1/payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(paymentPayload),
            });

            const paymentData = await paymentResponse.json();
            console.log("Payment Response:", paymentData);

            if (!paymentData.success) {
                alert("Gagal melakukan pembayaran.");
                return;
            }

            // **3. Update UI dan beri notifikasi sukses**
            setAssignment((prev) => prev ? { ...prev, status: "Completed" } : null);
            alert("Assignment selesai dan pembayaran berhasil!");

            // **4. Redirect ke Midtrans untuk pembayaran**
            const midtransRedirectUrl = paymentData.data.midtrans_transaction.redirect_url;
            if (midtransRedirectUrl) {
                window.location.href = midtransRedirectUrl; // Redirect ke halaman pembayaran Midtrans
            } else {
                alert("Pembayaran berhasil, tetapi tidak ada URL redirect.");
            }

        } catch (error) {
            console.error("Error in completing job and making payment:", error);
            alert("Terjadi kesalahan, coba lagi.");
        }
    };

    return (
        <div className="dashboard flex">
            {/* Sidebar */}
            <SidebarEmployer
                isSidebarMinimized={isSidebarMinimized}
                toggleSidebar={() => setIsSidebarMinimized(!isSidebarMinimized)}
            />

            {/* Main Content */}
            <div className="main-content flex-1">
                <HeaderEmployer
                    isProfileMenuOpen={isProfileMenuOpen}
                    toggleProfileMenu={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                />

                <main className="dashboard-content">
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : assignment ? (
                        <div className="assignment-card bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                Detail Assignment
                            </h2>

                            {/* Informasi Pekerjaan */}
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-700">
                                    Pekerjaan: {assignment.JobApplication.Job.title}
                                </h3>
                                <p className="text-gray-600">
                                    {assignment.JobApplication.Job.description}
                                </p>
                                <p className="text-gray-600">
                                    <strong>Lokasi:</strong> {assignment.JobApplication.Job.location}
                                </p>
                                <p className="text-gray-600">
                                    <strong>Gaji:</strong> Rp {assignment.JobApplication.Job.salary}
                                </p>
                            </div>

                            {/* Informasi Pelamar */}
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-700">Pelamar</h3>
                                <p className="text-gray-600">
                                    <strong>Username:</strong> {assignment.JobApplication.user_id}
                                </p>
                                <p className="text-gray-600">
                                    <strong>Status Aplikasi:</strong> {assignment.JobApplication.status}
                                </p>
                            </div>

                            {/* Status Assignment */}
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-700">Status Assignment</h3>
                                <p className={`text-sm font-semibold px-3 py-1 rounded ${assignment.status === "Assigned" ? "bg-green-500 text-white" : "bg-blue-500 text-white"}`}>
                                    {assignment.status}
                                </p>
                            </div>

                            {/* Tombol Aksi */}
                            <div className="mt-6">
                                {assignment.status === "Assigned" && (
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded shadow"
                                        onClick={markAsComplete}
                                    >
                                        Tandai Selesai
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-600">Data tidak ditemukan.</p>
                    )}
                </main>
            </div>
        </div>
    );
};

export default JobAssignmentPage;
