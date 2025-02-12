"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InputField from "../../../components/atoms/InputField";

interface Province {
    id: string;
    name: string;
}

interface City {
    id: string;
    name: string;
}

export default function RegisterWorker() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        phone: "",
        additionalData: {
            name: "",
            address: "",
            gender: "",
            province: "",
            city: "",
            student_card_photo: "", // Changed to match API field name
        },
    });

    const [provinces, setProvinces] = useState<Province[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Fetch provinces and store both ID and name
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json");
                const data = await res.json();
                setProvinces(data);
            } catch (err) {
                console.error("Error fetching provinces:", err);
            }
        };

        fetchProvinces();
    }, []);

    // Fetch cities and store both ID and name
    useEffect(() => {
        const fetchCities = async () => {
            if (formData.additionalData.province) {
                try {
                    const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${formData.additionalData.province}.json`);
                    const data = await res.json();
                    setCities(data);
                } catch (err) {
                    console.error("Error fetching cities:", err);
                }
            } else {
                setCities([]);
            }
        };

        fetchCities();
    }, [formData.additionalData.province]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            !formData.additionalData.address ||
            !formData.additionalData.gender ||
            !formData.additionalData.province ||
            !formData.additionalData.city ||
            !formData.additionalData.student_card_photo
        ) {
            setError("All fields are required");
            setLoading(false);
            return;
        }

        try {
            // Get province and city names instead of IDs for the API
            const selectedProvince = provinces.find(p => p.id === formData.additionalData.province);
            const selectedCity = cities.find(c => c.id === formData.additionalData.city);

            // Prepare the payload with the actual names instead of IDs
            const payload = {
                ...formData,
                additionalData: {
                    ...formData.additionalData,
                    province: selectedProvince?.name.toLowerCase() || "",
                    city: selectedCity?.name.toLowerCase() || "",
                }
            };

            const response = await fetch("https://dailyquest.space/api/v1/auth/register?role=2", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
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

    // Rest of the JSX remains the same, just update the student card photo field name
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-4 text-gray-900">Register as Worker</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField label="Username" type="text" name="username" value={formData.username} onChange={handleChange} required />
                    <InputField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required />
                    <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
                    <InputField label="Phone" type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                    <InputField label="Name" type="text" name="additionalData.name" value={formData.additionalData.name} onChange={handleChange} required />
                    <InputField label="Address" type="text" name="additionalData.address" value={formData.additionalData.address} onChange={handleChange} required />
                    <InputField
                        label="Student Card Photo URL"
                        type="text"
                        name="additionalData.student_card_photo"
                        value={formData.additionalData.student_card_photo}
                        onChange={handleChange}
                        required
                    />

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">Gender</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="additionalData.gender"
                                    value="Male"
                                    checked={formData.additionalData.gender === "Male"}
                                    onChange={handleChange}
                                    className="mr-2 text-gray-600"
                                    required
                                />
                                Male
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="additionalData.gender"
                                    value="Female"
                                    checked={formData.additionalData.gender === "Female"}
                                    onChange={handleChange}
                                    className="mr-2 text-gray-600"
                                    required
                                />
                                Female
                            </label>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">Province</label>
                        <select
                            name="additionalData.province"
                            value={formData.additionalData.province}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-600"
                            required
                        >
                            <option value="">Select Province</option>
                            {provinces.map((prov) => (
                                <option key={prov.id} value={prov.id}>
                                    {prov.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">City</label>
                        <select
                            name="additionalData.city"
                            value={formData.additionalData.city}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-600"
                            required
                            disabled={!formData.additionalData.province}
                        >
                            <option value="">Select City</option>
                            {cities.map((city) => (
                                <option key={city.id} value={city.id}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700" disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </button>

                    {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                    {success && <p className="text-green-500 text-center mt-2">{success}</p>}
                </form>
            </div>
        </div>
    );
}