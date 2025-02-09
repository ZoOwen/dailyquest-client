
// pages/employer/index.tsx

"use client";

import { useState, useEffect } from "react";
import SidebarEmployer from "../components/layout/SidebarEmployer";
import HeaderEmployer from "../components/layout/HeaderEmployer";
import '../dashboard.css';

const EmployerPage = () => {
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

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
                    {/* Stats Grid */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3 className="stat-title">Total Lowongan Aktif</h3>
                            <p className="stat-value">8</p>
                        </div>
                        <div className="stat-card">
                            <h3 className="stat-title">Kandidat Baru</h3>
                            <p className="stat-value">24</p>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="content-grid">
                        {/* Recent Applications */}
                        <div className="content-card">
                            <div className="card-header">
                                <h2 className="card-title">Lamaran Terbaru</h2>
                            </div>
                            <div className="card-content">
                                <div className="list-item">
                                    <div className="item-info">
                                        <h3>John Doe</h3>
                                        <p>Frontend Developer</p>
                                    </div>
                                    <span className="status-badge status-new">Baru</span>
                                </div>
                                <div className="list-item">
                                    <div className="item-info">
                                        <h3>Jane Smith</h3>
                                        <p>UI/UX Designer</p>
                                    </div>
                                    <span className="status-badge status-review">Direview</span>
                                </div>
                                <div className="list-item">
                                    <div className="item-info">
                                        <h3>Mike Johnson</h3>
                                        <p>Backend Developer</p>
                                    </div>
                                    <span className="status-badge status-interview">Interview</span>
                                </div>
                            </div>
                        </div>

                        {/* Active Jobs */}
                        <div className="content-card">
                            <div className="card-header">
                                <h2 className="card-title">Lowongan Aktif</h2>
                            </div>
                            <div className="card-content">
                                <div className="list-item">
                                    <div className="item-info">
                                        <h3>Senior Frontend Developer</h3>
                                        <p>15 lamaran</p>
                                    </div>
                                    <span className="status-badge status-new">Aktif</span>
                                </div>
                                <div className="list-item">
                                    <div className="item-info">
                                        <h3>UI/UX Designer</h3>
                                        <p>8 lamaran</p>
                                    </div>
                                    <span className="status-badge status-new">Aktif</span>
                                </div>
                                <div className="list-item">
                                    <div className="item-info">
                                        <h3>Backend Developer</h3>
                                        <p>12 lamaran</p>
                                    </div>
                                    <span className="status-badge status-review">Ditutup</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default EmployerPage;
