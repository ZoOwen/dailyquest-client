"use client";

import { useState } from "react";
import InputField from "../atoms/InputField";
import FileUpload from "../atoms/FileUpload";
import { usePathname } from "next/navigation";

export default function RegisterForm() {
    const pathname = usePathname();
    const isEmployer = pathname.includes("employer");
    const isWorker = pathname.includes("worker");

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        phone: "",
        name: "",
        company_name: "",
        address: "",
        gender: "",
        city: "",
        province: "",
    });
    const [studentCardPhoto, setStudentCardPhoto] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

        try {
            const role = isEmployer ? "1" : "2"; // Role 1 = Employer, Role 2 = Worker
            const apiUrl = `http://localhost:3000/api/v1/auth/register?role=${role}`;
            const formDataToSend = new FormData();

            // Tambahkan data ke FormData
            formDataToSend.append("username", formData.username);
            formDataToSend.append("password", formData.password);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("phone", formData.phone);
            formDataToSend.append("additionalData[name]", formData.name);
            formDataToSend.append("additionalData[address]", formData.address);

            // Employer Fields
            if (isEmployer) {
                formDataToSend.append("additionalData[company_name]", formData.company_name);
            }

            // Worker Fields
            if (isWorker) {
                formDataToSend.append("additionalData[gender]", formData.gender);
                formDataToSend.append("additionalData[city]", formData.city);
                formDataToSend.append("additionalData[province]", formData.province);
                if (studentCardPhoto) {
                    formDataToSend.append("additionalData[student_card_photo]", studentCardPhoto);
                }
            }

            const res = await fetch(apiUrl, {
                method: "POST",
                body: formDataToSend,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Registration failed");

            setSuccess("Registration successful!");
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
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-4">
                {isEmployer ? "Register as Employer" : "Register as Worker"}
            </h2>

            <InputField label="Username" type="text" name="username" value={formData.username} onChange={handleChange} required />
            <InputField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required />
            <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
            <InputField label="Phone" type="text" name="phone" value={formData.phone} onChange={handleChange} required />
            <InputField label="Name" type="text" name="name" value={formData.name} onChange={handleChange} required />
            <InputField label="Address" type="text" name="address" value={formData.address} onChange={handleChange} required />

            {isEmployer && <InputField label="Company Name" type="text" name="company_name" value={formData.company_name} onChange={handleChange} required />}
            {isWorker && <>
                <InputField label="Gender" type="text" name="gender" value={formData.gender} onChange={handleChange} required />
                <InputField label="City" type="text" name="city" value={formData.city} onChange={handleChange} required />
                <InputField label="Province" type="text" name="province" value={formData.province} onChange={handleChange} required />
                <FileUpload label="Student Card Photo" name="student_card_photo" onChange={handleFileChange} />
            </>}

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700" disabled={loading}>
                {loading ? "Registering..." : "Register"}
            </button>

            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
            {success && <p className="text-green-500 text-center mt-2">{success}</p>}
        </form>
    );
}
