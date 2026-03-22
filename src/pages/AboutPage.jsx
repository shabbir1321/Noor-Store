import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './AboutPage.css';

const AboutPage = () => {
    return (
        <div className="about-page">
            <Navbar />

            <main className="about-main">
                <section className="about-hero">
                    <div className="about-container">
                        <div className="about-text-group">
                            <span className="about-tag">Est. in Burhanpur</span>
                            <h1 className="about-title">A Legacy of <br />Personalization</h1>
                            <p className="about-desc">
                                Located in the historic heart of <strong>Burhanpur</strong>, Noor Creation is born from a passion for bespoke craftsmanship.
                                We don't just print; we bring your vision to life on high-quality materials, ensuring every piece reflects the premium quality our city is known for.
                            </p>
                            <div className="about-stats">
                                <div className="stat-item">
                                    <span className="stat-num">500+</span>
                                    <span className="stat-label">Unique Products</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-num">Burhanpur, MP</span>
                                    <span className="stat-label">Home Grown</span>
                                </div>
                            </div>
                        </div>
                        <div className="about-image-collage">
                            <div className="collage-main">
                                <img src="https://images.unsplash.com/photo-1541810271594-7330005d5b92?w=800&q=80" alt="Workshop" />
                            </div>
                            <div className="collage-sub">
                                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80" alt="Detail" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="about-values">
                    <div className="values-grid">
                        <div className="value-card">
                            <h3>Quality First</h3>
                            <p>We source only the finest materials, from organic cotton to studio-grade ceramics.</p>
                        </div>
                        <div className="value-card">
                            <h3>Real-time Design</h3>
                            <p>Our intuitive tools allow you to visualize your creation before it ever hits the press.</p>
                        </div>
                        <div className="value-card">
                            <h3>Heritage Driven</h3>
                            <p>Every order is processed with the meticulous care that defines our Burhanpur workshop.</p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default AboutPage;
