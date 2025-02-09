"use client";

import { useState, useEffect } from "react";
import SidebarEmployer from "../../components/layout/SidebarEmployer";
import HeaderEmployer from "../../components/layout/HeaderEmployer";
import { Edit2, UserCheck, Users } from "react-feather";
import Link from "next/link";
import '../../dashboard.css';

interface DecodedToken {
    id: number;
    username: string;
    role: number;
    iat: number;
    exp: number;
}

const EmployerPage = () => {
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [jobs, setJobs] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [jobsPerPage] = useState(10);
    const [userId, setUserId] = useState<number | null>(null); // Gunakan state untuk menyimpan user ID

    // Ambil token saat komponen di-render
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const decodedToken: DecodedToken = JSON.parse(window.atob(base64));
                setUserId(decodedToken.id); // Simpan userId ke state
            } catch (error) {
                console.error("Error parsing JWT:", error);
            }
        }
    }, []);

    // Toggle Sidebar
    const toggleSidebar = () => setIsSidebarMinimized(!isSidebarMinimized);

    // Toggle Profile Dropdown
    const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

    // Fetch jobs dari API berdasarkan userId
    useEffect(() => {
        if (!userId) return; // Jangan fetch jika userId belum ada

        const fetchJobs = async () => {
            try {
                const url = `http://localhost:5000/api/v1/job?user_id=${userId}`;
                const response = await fetch(url);
                const data = await response.json();

                if (data?.data?.rows?.length) {
                    setJobs(data.data.rows);
                } else {
                    setJobs([]);
                }
            } catch (error) {
                console.error("Error fetching jobs:", error);
                setJobs([]);
            }
        };

        fetchJobs();
    }, [userId]); // Fetch ulang jika userId berubah

    // Handle pagination
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="dashboard flex">
            {/* Sidebar */}
            <SidebarEmployer isSidebarMinimized={isSidebarMinimized} toggleSidebar={toggleSidebar} />

            {/* Main Content */}
            <div className="main-content flex-1">
                <HeaderEmployer isProfileMenuOpen={isProfileMenuOpen} toggleProfileMenu={toggleProfileMenu} />

                <main className="dashboard-content">
                    <div className="filter-section">
                        <select>
                            <option value="all">Semua Status</option>
                            <option value="active">Aktif</option>
                            <option value="closed">Tutup</option>
                        </select>
                        <select>
                            <option value="all">Semua Departemen</option>
                            <option value="technology">Technology</option>
                            <option value="marketing">Marketing</option>
                        </select>
                    </div>

                    {/* Tabel Menampilkan Pekerjaan */}
                    <table className="job-table">
                        <thead>
                            <tr>
                                <th>Posisi</th>
                                <th>Departemen</th>
                                <th>Tanggal Posting</th>
                                <th>Gaji</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentJobs.length > 0 ? (
                                currentJobs.map((job) => (
                                    <tr key={job.id}>
                                        <td>{job.title}</td>
                                        <td>{job.category}</td>
                                        <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                                        <td>{job.salary}</td>
                                        <td>
                                            <span className={`status-badge ${job.status.toLowerCase() === "open" ? "bg-blue-500 text-white px-2 py-1 rounded" : `status-${job.status.toLowerCase()}`}`}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="actions">
                                                <Link href="#" className="btn btn-primary"> <Edit2 /> </Link>

                                                {job.status.toLowerCase() !== "closed" && (
                                                    <Link href={`/employer/jobs/${job.id}`} className="btn btn-primary">
                                                        <Users />
                                                    </Link>
                                                )}

                                                {job.status.toLowerCase() === "closed" && (
                                                    <Link href={`/employer/jobs/assigment/${job.id}`} className="btn btn-primary">
                                                        <UserCheck />
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6}>No jobs available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="pagination">
                        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                            &lt;
                        </button>
                        <button className={currentPage === 1 ? 'active' : ''} onClick={() => paginate(1)}>
                            1
                        </button>
                        <button className={currentPage === 2 ? 'active' : ''} onClick={() => paginate(2)}>
                            2
                        </button>
                        <button className={currentPage === 3 ? 'active' : ''} onClick={() => paginate(3)}>
                            3
                        </button>
                        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(jobs.length / jobsPerPage)}>
                            &gt;
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default EmployerPage;
