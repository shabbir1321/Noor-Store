import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CorporatePage.css';

const CorporatePage = () => {
    return (
        <div className="corporate-page">
            <Navbar />

            <main className="corp-main-minimal">
                <header className="corp-empty-header">
                    <span className="corp-tag">Corporate Solutions</span>
                    <h1 className="corp-title-minimal">Bespoke Enterprise <br />Services</h1>
                    <p className="corp-desc-minimal">
                        We are currently refining our corporate experience. Custom branding, bulk gifting, and enterprise fulfillment solutions are coming soon.
                    </p>
                </header>

                <section className="corp-contact-placeholder">
                    <h2>Interested in Bulk Orders?</h2>
                    <p>Contact our concierge team directly for early access to corporate pricing.</p>
                    <a href="https://wa.me/yournumber" className="btn-corp-minimal">Inquire on WhatsApp</a>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default CorporatePage;
