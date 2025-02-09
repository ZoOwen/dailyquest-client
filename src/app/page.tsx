"use client";

import { useState, useEffect } from 'react';
import Header from "../app/components/layout/Header";
import Footer from "../app/components/layout/Footer";
import "./dashboard.css";

export default function ProfilePage() {
    const [jobCount, setJobCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (jobCount < 1000) {
                setJobCount(prev => prev + 5);
            }
        }, 20);
        return () => clearInterval(interval);
    }, [jobCount]);

    return (
        <div className="bg-gray-100 font-roboto min-h-screen flex flex-col">
            <Header />

            {/* Main Profile Layout */}
            <div className="w-full h-full p-10 flex flex-col md:flex-row justify-between bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg rounded-lg relative overflow-hidden">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diamond-pattern.png')] opacity-20"></div>

                {/* Header Section */}
                <header className="header-section w-full md:w-2/3 relative z-10">
                    <div className="header-content text-white p-8">
                        <h1 className="text-5xl font-bold leading-tight mb-6">Welcome to Daily Quest</h1>
                        <p className="mt-4 text-xl mb-8">
                            Temukan pekerjaan seru, dari part-time, full-time, hingga tugas kuliah, semua ada di Daily Quest!
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 transform transition-all hover:scale-105">
                                <div className="text-4xl font-bold mb-2">{jobCount}+</div>
                                <div className="text-sm">Pekerjaan Tersedia</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 transform transition-all hover:scale-105">
                                <div className="text-4xl font-bold mb-2">24/7</div>
                                <div className="text-sm">Dukungan Online</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 transform transition-all hover:scale-105">
                                <div className="text-4xl font-bold mb-2">500+</div>
                                <div className="text-sm">Mahasiswa Bergabung</div>
                            </div>
                        </div>
                        <button className="cta-button mt-8 bg-yellow-400 text-white px-8 py-3 rounded-full shadow hover:bg-yellow-500 transform transition-all hover:scale-105">
                            Mulai Sekarang
                        </button>
                    </div>
                </header>

                {/* Main Content Section */}
                <section className="description w-full md:w-1/3 p-6 relative z-10">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 text-white">
                        <h2 className="text-3xl font-semibold mb-4">Apa itu Daily Quest?</h2>
                        <p className="text-lg">
                            Daily Quest adalah platform yang dibuat untuk membantu mahasiswa menemukan pekerjaan yang sesuai
                            dengan kebutuhan mereka, baik itu full-time, part-time, pekerjaan harian, bahkan joki tugas!
                            Aplikasi ini menyediakan berbagai pekerjaan ringan yang bisa dilakukan di waktu luang.
                        </p>
                    </div>
                </section>
            </div>

            {/* Features Section */}
            <section className="features py-16 bg-gray-100">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                    <div className="feature bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                        <div className="text-3xl font-bold text-blue-600 mb-4">🎯</div>
                        <h3 className="text-xl font-semibold mb-3">Beragam Pilihan Pekerjaan</h3>
                        <p className="text-gray-600">Temukan berbagai macam pekerjaan yang sesuai dengan waktu dan kemampuanmu!</p>
                    </div>
                    <div className="feature bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                        <div className="text-3xl font-bold text-blue-600 mb-4">⏰</div>
                        <h3 className="text-xl font-semibold mb-3">Pekerjaan Fleksibel</h3>
                        <p className="text-gray-600">Kerja bisa full-time, part-time, atau hanya sekedar mengerjakan tugas. Sesuai kebutuhanmu.</p>
                    </div>
                    <div className="feature bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                        <div className="text-3xl font-bold text-blue-600 mb-4">📱</div>
                        <h3 className="text-xl font-semibold mb-3">Akses Mudah</h3>
                        <p className="text-gray-600">Semua pekerjaan dapat diakses dengan mudah lewat aplikasi Daily Quest kapan saja dan dimana saja.</p>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="cta-section bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diamond-pattern.png')] opacity-20"></div>
                <div className="relative z-10">
                    <h2 className="text-4xl font-bold mb-6">Bergabunglah dengan Daily Quest</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">Mulai perjalanan kerjamu sekarang juga dengan Daily Quest! Gak ada pekerjaan yang terlalu kecil!</p>
                    <button className="cta-button bg-yellow-400 text-white px-8 py-4 rounded-full shadow-lg hover:bg-yellow-500 transform transition-all hover:scale-105">
                        Gabung Sekarang
                    </button>
                </div>
            </section>

            <Footer />
        </div>
    );
}