"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InputField from "../../..//components/atoms/InputField";
import FileUpload from "../../..//components/atoms/FileUpload";

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
        name: "",
        address: "",
        gender: "",
        province: "",
        city: "",
    });
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [studentCardPhoto, setStudentCardPhoto] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Fetch provinces on component mount
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

    // Fetch cities when a province is selected
    useEffect(() => {
        const fetchCities = async () => {
            if (formData.province) {
                try {
                    const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${formData.province}.json`);
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
    }, [formData.province]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setStudentCardPhoto(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        // 🔥 DEBUG: Cek semua nilai sebelum submit
        console.log("Form Data:", formData);
        console.log("Student Card Photo:", studentCardPhoto);

        // Cek apakah ada input yang kosong
        if (
            !formData.username ||
            !formData.password ||
            !formData.email ||
            !formData.phone ||
            !formData.name ||
            !formData.address ||
            !formData.gender ||
            !formData.province ||
            !formData.city ||
            !studentCardPhoto
        ) {
            console.error("❌ ERROR: Ada field yang kosong!");
            setError("All fields are required");
            setLoading(false);
            return;
        }

        try {
            const apiUrl = `http://147.93.106.89:5000/api/v1/auth/register?role=2`;
            const formDataToSend = new FormData();

            // Append semua data ke FormData
            formDataToSend.append("username", formData.username);
            formDataToSend.append("password", formData.password);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("phone", formData.phone);
            formDataToSend.append("additionalData[name]", formData.name);
            formDataToSend.append("additionalData[address]", formData.address);
            formDataToSend.append("additionalData[gender]", formData.gender);
            formDataToSend.append("additionalData[province]", formData.province);
            formDataToSend.append("additionalData[city]", formData.city);

            if (studentCardPhoto) {
                formDataToSend.append("additionalData[student_card_photo]", studentCardPhoto);
            }

            // 🔥 DEBUG: Cek isi FormData sebelum dikirim
            console.log("FormData to send:", formDataToSend);

            const res = await fetch(apiUrl, {
                method: "POST",
                body: formDataToSend,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Registration failed");

            setSuccess("Registration successful!");
            setTimeout(() => router.push("/auth/login"), 2000);
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error("❌ API ERROR:", err.message);
                setError(err.message);
            } else {
                console.error("❌ Unknown error occurred.");
                setError("An unknown error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-4 text-gray-900" >Register as Worker</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField label="Username" type="text" name="username" value={formData.username} onChange={handleChange} required />
                    <InputField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required />
                    <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
                    <InputField label="Phone" type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                    <InputField label="Name" type="text" name="name" value={formData.name} onChange={handleChange} required />
                    <InputField label="Address" type="text" name="address" value={formData.address} onChange={handleChange} required />
                    {/* Gender Radio Button */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">Gender</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Male"
                                    checked={formData.gender === "Male"}
                                    onChange={handleChange}
                                    className="mr-2 text-gray-600"
                                    required
                                />
                                Male
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Female"
                                    checked={formData.gender === "Female"}
                                    onChange={handleChange}
                                    className="mr-2 text-gray-600"
                                    required
                                />
                                Female
                            </label>
                        </div>
                    </div>


                    {/* Province Dropdown */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">Province</label>
                        <select
                            name="province"
                            value={formData.province}
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

                    {/* City Dropdown */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">City</label>
                        <select
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-600"
                            required
                            disabled={!formData.province} // Disable jika province belum dipilih
                        >
                            <option value="">Select City</option>
                            {cities.map((city) => (
                                <option key={city.id} value={city.id}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <FileUpload label="Student Card Photo" name="student_card_photo" onChange={handleFileChange} />


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


