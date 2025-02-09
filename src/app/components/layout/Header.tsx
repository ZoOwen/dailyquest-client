"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload(); // Refresh halaman setelah logout
        window.location.href = "/auth/login";
    };

    return (
        <header className="bg-blue-600 text-white py-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Daily Quest</h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li><Link href="/" className="hover:text-gray-200">Home</Link></li>
                        <li><Link href="/jobs" className="hover:text-gray-200">Jobs</Link></li>
                        <li><Link href="/about" className="hover:text-gray-200">About Us</Link></li>
                        <li><Link href="/contact" className="hover:text-gray-200">Contact</Link></li>
                    </ul>
                </nav>
                <div className="relative">
                    {!isLoggedIn ? (
                        // Jika user belum login, tampilkan tombol Login & Sign Up
                        <div>
                            <Link href="/auth/login" className="bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-gray-100">
                                Login
                            </Link>
                            <Link href="/auth/register" className="ml-2 bg-yellow-400 text-white px-4 py-2 rounded shadow hover:bg-yellow-500">
                                Sign Up
                            </Link>
                        </div>
                    ) : (
                        // Jika user sudah login, tampilkan tombol Profile dengan dropdown
                        <div>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-gray-100 flex items-center"
                            >
                                Profile ▼
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md">
                                    <ul className="text-gray-800">
                                        <li><Link href="/profile" className="block px-4 py-2 hover:bg-gray-200">Profile</Link></li>
                                        <li><Link href="/profile/application-history" className="block px-4 py-2 hover:bg-gray-200">History Application</Link></li>
                                        <li><Link href="/history-pekerjaan" className="block px-4 py-2 hover:bg-gray-200">History Pekerjaan</Link></li>
                                        <li><Link href="/keuangan" className="block px-4 py-2 hover:bg-gray-200">Keuangan</Link></li>
                                        <li>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-200"
                                            >
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
