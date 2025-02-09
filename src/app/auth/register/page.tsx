"use client";

import { useRouter } from "next/navigation";

export default function RegisterSelection() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md text-center">
                <h2 className="text-2xl font-bold mb-6">Choose Your Registration</h2>

                <button
                    onClick={() => router.push("/auth/register/employer")}
                    className="w-full mb-4 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                    Register as Employer
                </button>

                <button
                    onClick={() => router.push("/auth/register/worker")}
                    className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition"
                >
                    Register as Worker
                </button>
            </div>
        </div>
    );
}
