// components/layout/HeaderEmployer.tsx

import { Feather, LogOut, PlusCircle } from "react-feather";
import Link from "next/link";

interface HeaderEmployerProps {
    isProfileMenuOpen: boolean;
    toggleProfileMenu: () => void;
}

const HeaderEmployer: React.FC<HeaderEmployerProps> = ({ isProfileMenuOpen }) => {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload(); // Refresh halaman setelah logout
        window.location.href = "/auth/login";
    };
    return (
        <header className="header">
            <div className="search-container">
                <Feather name="search" className="search-icon" />
                <input type="text" className="search-input" placeholder="Cari kandidat atau pekerjaan..." />
            </div>
            <div className="profile-container">
                <button className="new-job-btn">
                    <PlusCircle />
                    <Link href="/employer/post-a-job"><span>Posting Pekerjaan</span></Link>
                </button>
                <div className="profile-dropdown">
                    <button className="profile-btn" id="profileBtn" onClick={handleLogout}>
                        <LogOut />
                        Log Out
                    </button>
                    {isProfileMenuOpen && (
                        <div className="dropdown-menu" id="profileMenu">
                            <a href="#" className="dropdown-item">
                                <Feather name="log-out" />
                                <span>Log Out</span>
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default HeaderEmployer;
