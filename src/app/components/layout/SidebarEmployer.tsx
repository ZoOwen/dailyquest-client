// components/layout/SidebarEmployer.tsx

import { Feather, Briefcase, Bell, Mail, Users } from "react-feather";

interface SidebarEmployerProps {
    isSidebarMinimized: boolean;
    toggleSidebar: () => void;
}

const SidebarEmployer: React.FC<SidebarEmployerProps> = ({ isSidebarMinimized, toggleSidebar }) => {
    return (
        <aside className={`sidebar ${isSidebarMinimized ? "minimized" : ""}`}>
            <div className="sidebar-header">
                <h1 className="sidebar-title">Employer Portal</h1>
                <button className="toggle-btn" onClick={toggleSidebar}>
                    <Feather name={isSidebarMinimized ? "chevron-right" : "chevron-left"} />
                </button>
            </div>
            <nav className="nav-menu">
                <a href="/employer/jobs" className="nav-item">
                    <Briefcase />
                    <span className="nav-label">Kelola Pekerjaan</span>
                    {/* <span className="badge">5</span> */}
                </a>
                <a href="#" className="nav-item">
                    <Users />
                    <span className="nav-label">Kandidat</span>
                    {/* <span className="badge">12</span> */}
                </a>
                <a href="#" className="nav-item">
                    <Mail />
                    <span className="nav-label">Pesan</span>
                    {/* <span className="badge">3</span> */}
                </a>
                <a href="#" className="nav-item">
                    <Bell />
                    <span className="nav-label">Notifikasi</span>
                    {/* <span className="badge">8</span> */}
                </a>
            </nav>
        </aside>
    );
};

export default SidebarEmployer;
