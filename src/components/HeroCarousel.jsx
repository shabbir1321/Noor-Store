import { useState, useEffect } from 'react';
import { carouselSlides } from '../data/products';
import { useNavigate } from 'react-router-dom';

export default function HeroCarousel() {
    const [current, setCurrent] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev === carouselSlides.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="hero-carousel">
            {carouselSlides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`carousel-slide ${index === current ? 'active' : ''}`}
                    style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url(${slide.image})` }}
                >
                    <div className="carousel-content container">
                        <p className="carousel-subtitle">✦ Noor Creation Exclusive ✦</p>
                        <h2 className="carousel-title">{slide.title}</h2>
                        <p className="carousel-text">{slide.subtitle}</p>
                        <button
                            className="carousel-btn"
                            onClick={() => navigate(slide.link)}
                        >
                            {slide.buttonText}
                        </button>
                    </div>
                </div>
            ))}

            <div className="carousel-indicators">
                {carouselSlides.map((_, idx) => (
                    <div
                        key={idx}
                        className={`indicator ${current === idx ? 'active' : ''}`}
                        onClick={() => setCurrent(idx)}
                        style={{
                            background: current === idx ? 'var(--color-primary)' : 'rgba(255,255,255,0.3)',
                            width: current === idx ? '30px' : '10px',
                            height: '10px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                    />
                ))}
            </div>
        </section>
    );
}
