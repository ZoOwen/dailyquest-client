// components/layout/SidebarEmployer.tsx

import Link from "next/link";
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
                <Link href="/employer/jobs" className="nav-item">
                    <Briefcase />
                    <span className="nav-label">Kelola Pekerjaan</span>
                    {/* <span className="badge">5</span> */}
                </Link>

            </nav>
        </aside>
    );
};

export default SidebarEmployer;
