"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "../../../components/atoms/InputField";

export default function RegisterEmployer() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        phone: "",
        additionalData: {
            name: "",
            company_name: "",
            address: "",
        },
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name.startsWith("additionalData")) {
            const field = name.split(".")[1];
            setFormData((prevData) => ({
                ...prevData,
                additionalData: {
                    ...prevData.additionalData,
                    [field]: value,
                },
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        // Validate required fields
        if (
            !formData.username ||
            !formData.password ||
            !formData.email ||
            !formData.phone ||
            !formData.additionalData.name ||
            !formData.additionalData.company_name ||
            !formData.additionalData.address
        ) {
            setError("All fields are required");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("https://dailyquest.space/api/v1/auth/register?role=1", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            setSuccess("Registration successful!");
            setTimeout(() => router.push("/auth/login"), 2000);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-4 text-gray-900">Register as Employer</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField
                        label="Username"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />

                    <InputField
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <InputField
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <InputField
                        label="Phone"
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />

                    <InputField
                        label="Full Name"
                        type="text"
                        name="additionalData.name"
                        value={formData.additionalData.name}
                        onChange={handleChange}
                        required
                    />

                    <InputField
                        label="Company Name"
                        type="text"
                        name="additionalData.company_name"
                        value={formData.additionalData.company_name}
                        onChange={handleChange}
                        required
                    />

                    <InputField
                        label="Address"
                        type="text"
                        name="additionalData.address"
                        value={formData.additionalData.address}
                        onChange={handleChange}
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>

                    {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                    {success && <p className="text-green-500 text-center mt-2">{success}</p>}
                </form>
            </div>
        </div>
    );
}