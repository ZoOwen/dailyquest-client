"use client";

import { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SearchBar from "../components/molecules/SearchBar";
import JobList from "../components/molecules/JobList";

export default function JobsPage() {
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");
    // Filter untuk kategori
    const [order, setOrder] = useState("DESC");  // Sorting berdasarkan tanggal
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fungsi untuk mengambil pekerjaan
    const fetchJobs = async () => {
        setLoading(true);
        setError("");

        const queryParams = new URLSearchParams();
        if (search) queryParams.append("search", search);
        if (order) queryParams.append("order", order);  // Menambahkan sorting

        try {
            const res = await fetch(`http://localhost:5000/api/v1/job?${queryParams.toString()}`);
            console.log("ini api nya", res)
            if (!res.ok) {
                throw new Error(`Failed to fetch jobs: ${res.statusText}`);
            }
            const data = await res.json();
            setJobs(data.data?.rows || []);
        } catch (err: unknown) {
            console.error("Error fetching jobs:", err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Fetch data pekerjaan saat pertama kali komponen dimuat
    useEffect(() => {
        fetchJobs();
    }, [search, order]);  // Fetch ulang saat ada perubahan di search, category, atau order

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchJobs();
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault(); // Mencegah aksi default (misalnya, pengiriman form jika ada)
        setOrder(e.target.value); // Set nilai yang dipilih
    };


    return (
        <div className="bg-gray-100 font-roboto min-h-screen flex flex-col">
            <Header />
            <section className="bg-blue-500 text-white py-20">
                <div className="container mx-auto text-center">
                    <h2 className="text-4xl font-bold">Find Your Dream Job with Daily Quest</h2>
                    <p className="mt-4">Join thousands of job seekers and recruiters today.</p>
                    <SearchBar search={search} setSearch={setSearch} handleSearch={handleSearch} />
                </div>
            </section>
            <section className="py-10">
                {/* Filter dan Sorting */}
                <div className="container mx-auto flex justify-between mb-8">

                    <div>
                        <label htmlFor="order" className="mr-2">Sort By:</label>
                        <select
                            id="order"
                            value={order}
                            onChange={handleChange}
                            className="border rounded px-4 py-2"
                        >
                            <option value="DESC">Newest</option>
                            <option value="ASC">Oldest</option>
                        </select>
                    </div>
                </div>

                {/* Daftar Pekerjaan */}
                <JobList jobs={jobs} loading={loading} error={error} />
            </section>
            <Footer />
        </div>
    );
}
