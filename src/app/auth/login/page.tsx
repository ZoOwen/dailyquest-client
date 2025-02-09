"use client";

import { useState } from "react";


interface DecodedToken {
    id: number;
    username: string;
    role: number;
    iat: number;
    exp: number;
}
export default function LoginPage() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("http://147.93.106.89:5000/api/v1/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "09x9a09ucsb8e7a908acabvaBkornblume", // Header Authorization
                },
                body: JSON.stringify(formData), // Kirim payload sebagai JSON
            });

            const data = await res.json();

            console.log("Login Response: ", data); // Menampilkan respon API di console log

            if (!res.ok) throw new Error(data.message || "Login failed");

            setSuccess("Login successful!");

            // Simpan token JWT ke localStorage
            localStorage.setItem("token", data.data.token);

            function parseJwt(token: string | null): DecodedToken | null {
                if (!token) {
                    return null; // Kembalikan null jika token tidak ada
                }
                const base64Url = token.split('.')[1]; // Ambil bagian payload dari JWT
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Decode base64 URL
                return JSON.parse(window.atob(base64)); // Parse payload menjadi objek
            }

            // Cek jika token ada dan valid
            const decodedToken = parseJwt(data.data.token);
            if (!decodedToken) {
                console.log("Token tidak valid atau tidak ada.");
                return null; // Jangan tampilkan JobCard jika token tidak ada atau tidak valid
            }
            // Redirect ke halaman pekerjaan (atau halaman yang diinginkan)
            if (decodedToken.role == 2) {
                window.location.href = "/jobs";
            } else {
                window.location.href = "/employer"
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 font-roboto min-h-screen">
            {/* Background with Gradient and Pattern */}
            <div className="relative min-h-screen bg-gradient-to-r from-blue-500 via-teal-600 to-blue-700">
                <div
                    className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diamond-pattern.png')] opacity-30"
                ></div>

                {/* Login Form Container */}
                <div className="flex min-h-screen justify-center items-center relative">
                    <div className="bg-white shadow-lg rounded-lg w-full sm:w-96 lg:w-1/3 p-8">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                            Login to Daily Quest
                        </h2>

                        {/* Feedback Messages */}
                        {error && <p className="text-red-500 text-center">{error}</p>}
                        {success && <p className="text-green-500 text-center">{success}</p>}

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-gray-600"
                                >
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:shadow-md transition duration-300"
                                    placeholder="Your username"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-600"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:shadow-md transition duration-300"
                                    placeholder="Your password"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-yellow-400 text-white py-3 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200 hover:shadow-lg"
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-600">
                            {`Don't have an account? `}
                            <a href="/auth/register" className="text-blue-600 hover:underline">
                                Sign up
                            </a>
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
}
