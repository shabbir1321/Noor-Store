import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ProductsPage.css';

const ProductsPage = () => {
    const { addToCart } = useCart();
    const [addedId, setAddedId] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    useEffect(() => {
        // Fetch Categories
        const unsubCats = onSnapshot(collection(db, "categories"), (snap) => {
            const cats = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCategories(cats);
        });

        // Fetch Products
        const qProd = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const unsubProd = onSnapshot(qProd, (snap) => {
            const prods = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(prods);
            setLoading(false);
        });

        return () => {
            unsubCats();
            unsubProd();
        };
    }, []);

    // Sync URL with Search params
    useEffect(() => {
        const cat = searchParams.get('category');
        if (cat) setSelectedCategory(cat);
        else setSelectedCategory('All');

        const search = searchParams.get('search');
        if (search) setSearchTerm(search);
    }, [searchParams]);

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'All' ||
            product.category === selectedCategory ||
            (product.secondaryCategories && product.secondaryCategories.includes(selectedCategory));
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const isActive = product.status !== 'hidden';
        return matchesCategory && matchesSearch && isActive;
    });

    const handleCategoryChange = (cat) => {
        setSelectedCategory(cat);
        const params = {};
        if (cat !== 'All') params.category = cat;
        if (searchTerm) params.search = searchTerm;
        setSearchParams(params);
    };

    const clearFilters = () => {
        setSelectedCategory('All');
        setSearchTerm('');
        setSearchParams({});
    };

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        setAddedId(product.id);
        setTimeout(() => setAddedId(null), 2000);
    };

    return (
        <div className="products-page">
            <Navbar />

            <div className="products-container">
                {/* PAGE HEADER */}
                <header className="products-header">
                    <div className="products-header-left">
                        <span className="products-tag">Our Collection</span>
                        <h1 className="products-title">
                            Browse <span className="products-title-accent">Catalog</span>
                        </h1>
                        <p className="products-desc">
                            Explore our curated range of premium customizable products. From sustainable apparel to studio-grade accessories.
                        </p>
                    </div>
                </header>

                {/* FILTER BAR */}
                <div className="filter-bar">
                    <div className="filter-chips">
                        <button
                            className={`filter-chip ${selectedCategory === 'All' ? 'active' : ''}`}
                            onClick={() => handleCategoryChange('All')}
                        >
                            All Products
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`filter-chip ${selectedCategory === cat.name ? 'active' : ''}`}
                                onClick={() => handleCategoryChange(cat.name)}
                            >
                                {cat.name}
                            </button>
                        ))}
                        <Link
                            to="/corporate"
                            className="filter-chip corporate-entry-chip"
                        >
                            Corporate & Bulk
                        </Link>
                    </div>
                </div>

                {/* PRODUCT GRID */}
                <main className="product-grid">
                    {loading ? (
                        [1, 2, 3, 4].map(i => <div key={i} className="product-card skeleton" style={{ height: '350px', background: 'var(--color-silver)', borderRadius: '4px' }} />)
                    ) : filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <div className="product-card" key={product.id} onClick={() => navigate(`/product/${product.id}`)}>
                                <div className="product-card-img">
                                    <Link to={`/product/${product.id}`} onClick={(e) => e.stopPropagation()}>
                                        <img src={product.img} alt={product.name} />
                                    </Link>
                                </div>
                                <div className="product-card-body">
                                    <div className="product-card-top">
                                        <span className="product-card-cat">{product.category}</span>
                                        <Link to={`/product/${product.id}`} onClick={(e) => e.stopPropagation()} className="product-card-link">
                                            <h3 className="product-card-name">{product.name}</h3>
                                        </Link>
                                    </div>
                                    <div className="product-meta">
                                        <span className="product-card-price">₹{product.price}</span>
                                        <button 
                                            className={`btn-add-cart-small ${addedId === product.id ? 'added' : ''}`}
                                            onClick={(e) => handleAddToCart(e, product)}
                                        >
                                            {addedId === product.id ? 'Added!' : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results-full">
                            <div className="no-results-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                            </div>
                            <h3>No items found</h3>
                            <p>Try adjusting your filters or search term to find what you're looking for.</p>
                            <button className="btn-clear-search" onClick={clearFilters}>Clear All Filters</button>
                        </div>
                    )}
                </main>
            </div>

            <Footer />
        </div>
    );
};


export default ProductsPage;
