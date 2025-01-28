"use client";

import { useState, useEffect } from "react";

export default function JobsPage() {
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("salary");
    const [order, setOrder] = useState("ASC");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Cek apakah user sudah login
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const fetchJobs = async () => {
        setLoading(true);
        setError("");

        const queryParams = new URLSearchParams();
        if (search) queryParams.append("search", search);
        if (sortBy) queryParams.append("sortBy", sortBy);
        if (order) queryParams.append("order", order);

        try {
            const res = await fetch(`http://localhost:5000/api/v1/job?${queryParams.toString()}`);
            if (!res.ok) {
                throw new Error(`Failed to fetch jobs: ${res.statusText}`);
            }
            const data = await res.json();

            // Ambil data dari `data.rows`
            setJobs(data.data?.rows || []);
        } catch (err: unknown) {
            console.error("Error fetching jobs:", err); // Log error ke console
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []); // Jalankan hanya sekali saat pertama kali halaman di-load

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchJobs();
    };

    return (
        <div className="bg-gray-100 font-roboto min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-blue-600 text-white py-4 shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Daily Quest</h1>
                    <nav>
                        <ul className="flex space-x-4">
                            <li><a href="/" className="hover:text-gray-200">Home</a></li>
                            <li><a href="#jobs" className="hover:text-gray-200">Jobs</a></li>
                            <li><a href="#about" className="hover:text-gray-200">About Us</a></li>
                            <li><a href="#contact" className="hover:text-gray-200">Contact</a></li>
                        </ul>
                    </nav>
                    {!isLoggedIn && ( // Tampilkan hanya jika user belum login
                        <div>
                            <a
                                href="/auth/login"
                                className="bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-gray-100"
                            >
                                Login
                            </a>
                            <a
                                href="/auth/register"
                                className="ml-2 bg-yellow-400 text-white px-4 py-2 rounded shadow hover:bg-yellow-500"
                            >
                                Sign Up
                            </a>
                        </div>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-blue-500 text-white py-20">
                <div className="container mx-auto text-center">
                    <h2 className="text-4xl font-bold">Find Your Dream Job with Daily Quest</h2>
                    <p className="mt-4">Join thousands of job seekers and recruiters today.</p>
                    <form onSubmit={handleSearch} className="mt-6 flex justify-center">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search jobs or companies"
                            className="w-2/3 px-4 py-2 rounded-l-lg text-black"
                        />
                        <button
                            type="submit"
                            className="bg-yellow-400 px-4 py-2 rounded-r-lg text-white hover:bg-yellow-500"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </section>

            {/* Job Listings */}
            <section id="jobs" className="py-10">
                <div className="container mx-auto">
                    <h3 className="text-2xl font-bold text-center mb-6">Latest Job Listings</h3>
                    {loading ? (
                        <p className="text-center">Loading...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : jobs.length === 0 ? (
                        <p className="text-center text-gray-500">No jobs found.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {jobs.map((job: any, index) => (
                                <div key={index} className="bg-white shadow rounded-lg p-4">
                                    <h4 className="font-bold text-lg text-gray-600">{job.title}</h4>
                                    <p className="text-gray-900">{job.category}</p>
                                    <p className="mt-2 text-sm text-gray-600">Location: {job.location}</p>
                                    <p className="mt-2 text-sm text-gray-600" >Salary: {job.salary}</p>
                                    <a
                                        href="#"
                                        className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                                    >
                                        Detail
                                    </a>   <a
                                        href="#"
                                        className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                                    >
                                        Gabung Instant
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-6 mt-auto">
                <div className="container mx-auto text-center">
                    <p>&copy; 2025 Daily Quest. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
