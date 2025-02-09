"use client";

import Header from "../app/components/layout/Header";
import Footer from "../app/components/layout/Footer";


export default function ProfilePage() {

    return (
        <div className="bg-gray-100 font-roboto min-h-screen flex flex-col">
            <Header />

            {/* Main Profile Layout */}
            <div className="w-full h-full p-10 flex flex-row justify-between bg-white shadow-lg rounded-lg">
                <header className="header-section" style={{ backgroundImage: 'url(https://via.placeholder.com/1500x600)' }}>
                    <div className="header-content">
                        <h1>Daily Quest</h1>
                        <p>Temukan pekerjaan seru, dari part-time, full-time, hingga tugas kuliah, semua ada di Daily Quest!</p>
                        <button className="cta-button">Mulai Sekarang</button>
                    </div>
                </header>

                {/* Main Content Section */}
                <section className="description">
                    <div className="content">
                        <h2>Apa itu Daily Quest?</h2>
                        <p>
                            Daily Quest adalah platform yang dibuat untuk membantu mahasiswa menemukan pekerjaan yang sesuai
                            dengan kebutuhan mereka, baik itu full-time, part-time, pekerjaan harian, bahkan joki tugas!
                            Aplikasi ini menyediakan berbagai pekerjaan ringan yang bisa dilakukan di waktu luang.
                            Di Daily Quest, tidak ada pekerjaan yang terlalu kecil.
                            Jika kamu butuh penghasilan tambahan atau sekedar pengalaman, Daily Quest adalah tempat yang tepat!
                        </p>
                    </div>
                </section>

                {/* Features Section */}
                <section className="features">
                    <div className="feature">
                        <h3>Beragam Pilihan Pekerjaan</h3>
                        <p>Temukan berbagai macam pekerjaan yang sesuai dengan waktu dan kemampuanmu!</p>
                    </div>
                    <div className="feature">
                        <h3>Pekerjaan Fleksibel</h3>
                        <p>Kerja bisa full-time, part-time, atau hanya sekedar mengerjakan tugas. Sesuai kebutuhanmu.</p>
                    </div>
                    <div className="feature">
                        <h3>Akses Mudah</h3>
                        <p>Semua pekerjaan dapat diakses dengan mudah lewat aplikasi Daily Quest kapan saja dan dimana saja.</p>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="cta-section">
                    <h2>Bergabunglah dengan Daily Quest</h2>
                    <p>Mulai perjalanan kerjamu sekarang juga dengan Daily Quest! Gak ada pekerjaan yang terlalu kecil!</p>
                    <button className="cta-button">Gabung Sekarang</button>
                </section>

            </div>

            <Footer />
        </div>
    );
}