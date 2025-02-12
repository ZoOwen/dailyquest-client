"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Import useParams
import SidebarEmployer from "../../../components/layout/SidebarEmployer";
import HeaderEmployer from "../../../components/layout/HeaderEmployer";
import '../../../dashboard.css';

interface Application {
    id: number;
    user_id: number;
    application_date: string;
    status: string;
    User: {
        id: number;
        username: string;
    };
    Job: {
        id: number;
        title: string;
        user_id: number;
    };
}

const JobApplicantsPage = () => {
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [applications, setApplications] = useState<Application[]>([]);
    const [jobTitle, setJobTitle] = useState<string>(""); // Untuk menyimpan judul pekerjaan
    const [token, setToken] = useState<string | null>(null); // Simpan token di state
    const [showModal, setShowModal] = useState(false); // Untuk mengatur apakah modal tampil
    const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null); // ID aplikasi yang dipilih

    const params = useParams(); // Ambil parameter URL
    const id = params.id; // Ambil id dari parameter URL

    // Ambil token setelah komponen di-mount
    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, []);

    // Toggle Sidebar
    const toggleSidebar = () => {
        setIsSidebarMinimized(!isSidebarMinimized);
    };

    // Toggle Profile Dropdown
    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(!isProfileMenuOpen);
    };

    // Menangani klik di luar profile dropdown untuk menutup menu
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const profileBtn = document.getElementById('profileBtn');
            const profileMenu = document.getElementById('profileMenu');
            if (profileBtn && profileMenu && !profileBtn.contains(e.target as Node) && !profileMenu.contains(e.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    // Fetch pelamar berdasarkan job_id
    useEffect(() => {
        if (id) {
            const fetchApplications = async () => {
                try {
                    const response = await fetch(`https://dailyquest.space/api/v1/application?job_id=${id}`);
                    const data = await response.json();
                    if (data && data.success) {
                        setApplications(data.data); // Menyimpan data pelamar
                        setJobTitle(data.data[0]?.Job?.title); // Menyimpan judul pekerjaan, jika ada pelamar
                    } else {
                        setApplications([]); // Jika tidak ada pelamar
                    }
                } catch (error) {
                    console.error("Error fetching applications:", error);
                    setApplications([]); // Menyimpan data kosong jika terjadi error
                }
            };

            fetchApplications();
        }
    }, [id]);

    // Fungsi untuk menerima pelamar dan melakukan POST request
    const acceptApplicant = async () => {
        if (selectedApplicationId) {
            try {
                const response = await fetch("https://dailyquest.space/api/v1/job-assigment", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`, // Pastikan token dikirim jika diperlukan
                    },
                    body: JSON.stringify({
                        job_application_id: selectedApplicationId,
                        job_id: id,
                        status: "Assigned",
                    }),
                });

                const data = await response.json();
                if (data.success) {
                    setApplications((prev) => prev.filter((app) => app.id !== selectedApplicationId));
                    setShowModal(false); // Menutup modal
                    alert("Pelamar diterima!");
                    window.location.href = "/employer/jobs"
                } else {
                    alert("Terjadi kesalahan saat menerima pelamar.");
                }
            } catch (error) {
                console.error("Error accepting applicant:", error);
                alert("Terjadi kesalahan, coba lagi.");
            }
        }
    };

    // Fungsi untuk menampilkan modal
    const showConfirmationModal = (applicationId: number) => {
        setSelectedApplicationId(applicationId);
        setShowModal(true);
    };

    // Fungsi untuk menutup modal
    const closeModal = () => {
        setShowModal(false);
        setSelectedApplicationId(null);
    };

    // Fungsi untuk menandai pelamar sebagai selesai
    const markAsComplete = async (applicationId: number) => {
        try {
            const response = await fetch("https://dailyquest.space/api/v1/job-assigment", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // Pastikan token dikirim jika diperlukan
                },
                body: JSON.stringify({
                    job_application_id: applicationId,

                    status: "Completed",
                }),
            });

            const data = await response.json();

            // Log response untuk mengetahui isi data yang diterima
            console.log('Response Data:', data);

            if (data.success) {
                // Update status di UI
                setApplications((prev) =>
                    prev.map((app) =>
                        app.id === applicationId ? { ...app, status: "Completed" } : app
                    )
                );
                alert("Pelamar selesai!");
            } else {
                alert("Terjadi kesalahan saat menandai sebagai selesai.");
            }
        } catch (error) {
            console.error("Error marking as complete:", error);
            alert("Terjadi kesalahan, coba lagi.");
        }

    };

    return (
        <div className="dashboard flex">
            {/* Sidebar */}
            <SidebarEmployer
                isSidebarMinimized={isSidebarMinimized}
                toggleSidebar={toggleSidebar}
            />

            {/* Main Content */}
            <div className="main-content flex-1">
                <HeaderEmployer
                    isProfileMenuOpen={isProfileMenuOpen}
                    toggleProfileMenu={toggleProfileMenu}
                />

                <main className="dashboard-content">
                    <h2>Pelamar untuk Pekerjaan: {jobTitle} {id}</h2>

                    {/* Tabel Menampilkan Pelamar */}
                    <table className="job-table">
                        <thead>
                            <tr>
                                <th>Nama Pengguna</th>
                                <th>Tanggal Melamar</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.length > 0 ? (
                                applications.map((application) => (
                                    <tr key={application.id}>
                                        <td>{application.User.username}</td>
                                        <td>{new Date(application.application_date).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`status-badge ${application.status.toLowerCase() === "pending" ? "bg-orange-500" : application.status.toLowerCase() === "assigned" ? "bg-green-500" : "bg-blue-500"}`}>
                                                {application.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="actions">
                                                {application.status === "Pending" && (
                                                    <button className="btn btn-primary" onClick={() => showConfirmationModal(application.id)}>Terima</button>
                                                )}

                                                {application.status === "Pending" && (
                                                    <button className="btn btn-primary">Tolak</button>
                                                )}

                                                {application.status === "Assigned" && (
                                                    <button className="btn btn-success" onClick={() => markAsComplete(application.id)}>Selesai </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3}>Tidak ada pelamar untuk pekerjaan ini</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Modal Konfirmasi */}
                    {showModal && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h3>Apakah Anda akan menerima Pelamar ini?</h3>
                                <div className="modal-actions">
                                    <button className="btn btn-success" onClick={acceptApplicant}>Ya</button>
                                    <button className="btn btn-danger" onClick={closeModal}>Tidak</button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default JobApplicantsPage;
