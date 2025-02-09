'use client';

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
// @ts-ignore
import L from "leaflet"; // Import Leaflet
import 'leaflet/dist/leaflet.css'; // Import CSS untuk Leaflet

// Definisikan tipe data
interface Employer {
    employer_name: string;
    employer_address: string;
}

interface JobDetail {
    id: number;
    title: string;
    description: string;
    category: string;
    salary: string;
    location: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    employer: Employer;
}

const getCoordinatesFromAddress = async (address: string) => {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
        );
        const data = await res.json();
        if (data.length > 0) {
            const { lat, lon } = data[0]; // Ambil lat dan lon dari respon
            return { lat: parseFloat(lat), lon: parseFloat(lon) };
        }
        throw new Error("Location not found");
    } catch (error) {
        console.error("Geocoding error:", error);
        return null;
    }
};

export default function JobDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id; // Ambil ID dari URL

    const [jobDetail, setJobDetail] = useState<JobDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
    const mapRef = useRef<L.Map | null>(null); // Ref untuk menyimpan instance peta
    const mapContainerRef = useRef<HTMLDivElement | null>(null); // Ref untuk menyimpan container peta

    useEffect(() => {
        if (!id) return; // Tunggu sampai id ada

        const fetchJobDetail = async () => {
            setLoading(true);
            setError(""); // Reset error

            try {
                const res = await fetch(`http://localhost:5000/api/v1/job/${id}`);
                if (!res.ok) {
                    throw new Error(`Failed to fetch job details: ${res.statusText}`);
                }
                const data = await res.json();
                setJobDetail(data.data); // Simpan data pekerjaan

                // Mengambil koordinat berdasarkan alamat pekerjaan
                const location = data.data.location; // Alamat "Jakarta, Indonesia"
                const coords = await getCoordinatesFromAddress(location);
                if (coords) {
                    setCoordinates(coords);
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

        fetchJobDetail();
    }, [id]);

    // Initialize map after coordinates are set and the map container is available
    useEffect(() => {
        if (coordinates && jobDetail && !mapRef.current) {
            // Ensure the map container is available in the DOM
            if (mapContainerRef.current) {
                // Hapus peta sebelumnya jika ada
                if (mapRef.current) {
                    mapRef.current.remove();
                    mapRef.current = null;
                }

                // Inisialisasi peta baru
                const newMap = L.map(mapContainerRef.current).setView([coordinates.lat, coordinates.lon], 13);

                // Set tile layer OSM
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                }).addTo(newMap);

                // Tambahkan marker pada lokasi pekerjaan
                L.marker([coordinates.lat, coordinates.lon])
                    .addTo(newMap)
                    .bindPopup(`<b>${jobDetail.title}</b><br>${jobDetail.location}`)
                    .openPopup();

                // Simpan instance peta ke ref
                mapRef.current = newMap;
            }
        }

        // Cleanup function untuk menghapus peta saat komponen unmount
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [coordinates, jobDetail]); // Re-run when coordinates or jobDetail changes

    // Kondisi loading atau error
    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    // Cek jika data pekerjaan tidak ada
    if (!jobDetail) return <div className="text-center">Job not found</div>;

    return (
        <div className="bg-gray-100 font-roboto min-h-screen flex flex-col">
            <Header />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-roboto">

                <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-800">{jobDetail.title}</h1>
                    <p className="mt-2 text-sm text-gray-600">{jobDetail.category}</p>
                    <p className="mt-4 text-lg text-gray-800">{jobDetail.description}</p>
                    <p className="mt-4 text-sm text-gray-600">
                        <span className="font-semibold">Location:</span> {jobDetail.location}
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                        <span className="font-semibold">Salary:</span> {jobDetail.salary}
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                        <span className="font-semibold">Status:</span> {jobDetail.status}
                    </p>

                    <div className="mt-6 border-t border-gray-300 pt-4">
                        <h2 className="text-xl font-semibold text-gray-700">Employer Details</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            <span className="font-semibold">Employer Name:</span> {jobDetail.employer.employer_name}
                        </p>
                        <p className="mt-2 text-sm text-gray-600">
                            <span className="font-semibold">Employer Address:</span> {jobDetail.employer.employer_address}
                        </p>
                    </div>

                    {/* Peta */}
                    {coordinates && (
                        <div ref={mapContainerRef} id="map" className="mt-6" style={{ height: "400px", width: "100%" }}></div>
                    )}

                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={() => router.push("/jobs")}
                            className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow hover:bg-blue-700 transition"
                        >
                            Back to Job Listings
                        </button>
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    );
}
