import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function CategoryPage() {
    const { id } = useParams();

    const category = useMemo(() => {
        return categories.find((c) => c.id === id);
    }, [id]);

    const categoryProducts = useMemo(() => {
        if (id === 'all') return products;
        return products.filter((p) => p.category === id);
    }, [id]);

    if (!category && id !== 'all') {
        return (
            <div className="container" style={{ padding: '8rem 1rem', textAlign: 'center' }}>
                <h2>Category not found</h2>
                <Link to="/" style={{ color: 'var(--color-primary)' }}>Return Home</Link>
            </div>
        );
    }

    const title = category?.name ?? 'All Products';
    const banner = category?.bannerImage ?? 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200';

    return (
        <div className="category-page" style={{ minHeight: '100vh', background: '#fff' }}>
            <div
                className="category-banner"
                style={{
                    height: '350px',
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.2)), url(${banner})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--color-border)'
                }}
            >
                <div className="container">
                    <div style={{ maxWidth: '600px' }}>
                        <h1 style={{ fontSize: '4rem', color: 'var(--color-text)', marginBottom: '1rem' }}>{title}</h1>
                        <p style={{ fontSize: '1.2rem', color: 'var(--color-primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px' }}>Handcrafted Selection</p>
                    </div>
                </div>
            </div>

            <div className="container" style={{ padding: '5rem 1.5rem' }}>
                <div className="section-header">
                    <div>
                        <h2 className="section-title">{title}</h2>
                        <p className="section-subtitle">Exquisite finds for your special moments</p>
                    </div>
                    <span className="product-count" style={{ fontWeight: '800', color: 'var(--color-primary)' }}>{categoryProducts.length} ITEMS</span>
                </div>

                {categoryProducts.length > 0 ? (
                    <div className="product-grid">
                        {categoryProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '10rem 0' }}>
                        <p style={{ fontSize: '1.5rem', color: 'var(--color-text-dim)' }}>Oops! We are currently handcrafting more treasures for this collection.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
