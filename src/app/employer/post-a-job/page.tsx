"use client";

import { useState } from "react";
import SidebarEmployer from "../../components/layout/SidebarEmployer";
import HeaderEmployer from "../../components/layout/HeaderEmployer";
import "../../dashboard.css";
interface DecodedToken {
    id: number;
    username: string;
    role: number;
    iat: number;
    exp: number;
}
export default function Page() {
    const token = localStorage.getItem("token");

    // Fungsi untuk mengurai JWT dan mendapatkan ID pengguna
    function parseJwt(token: string | null): DecodedToken | null {
        if (!token) {
            return null; // Kembalikan null jika token tidak ada
        }
        const base64Url = token.split('.')[1]; // Ambil bagian payload dari JWT
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Decode base64 URL
        return JSON.parse(window.atob(base64)); // Parse payload menjadi objek
    }

    // Cek jika token ada dan valid
    const decodedToken = parseJwt(token);
    if (!decodedToken) {
        console.log("Token tidak valid atau tidak ada.");
        return null; // Jangan tampilkan JobCard jika token tidak ada atau tidak valid
    }

    const { id: userId } = decodedToken;
    console.log("hitted ini pasti,", decodedToken)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        salary: "",
        location: "",
        user_id: userId,  // Dummy value for employer_id
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);


    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const response = await fetch("http://localhost:5000/api/v1/job/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to create job");
            }

            const data = await response.json();
            if (data.success) {
                setSuccess(true);
                setFormData({
                    title: "",
                    description: "",
                    category: "",
                    salary: "",
                    location: "",
                    user_id: userId,
                });
            } else {
                setError("Error: " + data.message);
            }
        } catch (err) {
            setError("An error occurred while creating the job.");
            console.log(err)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard flex">
            <SidebarEmployer />
            <div className="main-content flex-1">
                <HeaderEmployer />

                <main className="dashboard-content p-6">
                    <h2 className="text-2xl font-semibold mb-4">Create New Job</h2>

                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    {success && <div className="text-green-500 mb-4">Job created successfully!</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-gray-700">Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-gray-700">Description</label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-gray-700">Category</label>
                            <input
                                type="text"
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="salary" className="block text-gray-700">Salary</label>
                            <input
                                type="number"
                                id="salary"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-gray-700">Location</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className={`w-full p-2 mt-4 bg-blue-600 text-white rounded-md ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={loading}
                            >
                                {loading ? "Creating Job..." : "Create Job"}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
}
