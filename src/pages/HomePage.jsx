import { useState, useMemo } from 'react';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import HeroCarousel from '../components/HeroCarousel';

export default function HomePage() {
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredProducts = useMemo(() => {
        if (activeCategory === 'all') return products;
        return products.filter((p) => p.category === activeCategory);
    }, [activeCategory]);

    const activeCategoryName = useMemo(() => {
        return categories.find((c) => c.id === activeCategory)?.name ?? 'All Treasures';
    }, [activeCategory]);

    return (
        <div className="home-page">
            <HeroCarousel />

            {/* Category Tabs - Branded Light Format */}
            <div className="categories-bar">
                <div className="container">
                    <div className="categories-scroll">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                <span className="cat-name">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Product Section */}
            <main className="products-section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">{activeCategoryName}</h2>
                            <p className="section-subtitle">Discover our handcrafted collections</p>
                        </div>
                        <span className="product-count">{filteredProducts.length} items</span>
                    </div>

                    <div className="product-grid">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
