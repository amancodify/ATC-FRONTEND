import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../../config';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/products`);
                const payload = response?.data?.data || response?.data || [];
                setProducts(Array.isArray(payload) ? payload : []);
                setError('');
            } catch (err) {
                console.error('Error fetching products:', err);
                setProducts([]);
                setError('Failed to load products. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="container py-4" style={{ minHeight: '90vh' }}>
            <div
                className="card"
                style={{
                    borderRadius: 20,
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    boxShadow: '0 24px 70px rgba(15, 23, 42, 0.14)',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f7faff 100%)',
                }}
            >
                <div className="card-body p-4 p-md-5">
                    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3">
                        <div>
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <h2 className="mb-0">Products</h2>
                            </div>
                            <div className="text-muted small">A complete view of all products added in the system.</div>
                        </div>
                        <div
                            className="px-3 py-2 rounded-pill text-white fw-semibold"
                            style={{ background: 'linear-gradient(90deg, #4f46e5, #2563eb)' }}
                        >
                            {products.length} {products.length === 1 ? 'product' : 'products'}
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-5 text-muted">
                            <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                            Loading products...
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger mb-0" style={{ borderRadius: 12 }}>{error}</div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-5 text-muted" style={{ background: '#f8fafc', borderRadius: 16, border: '1px dashed #cbd5e1' }}>
                            No products found yet.
                        </div>
                    ) : (
                        <div className="row" style={{ margin: '-0.75rem' }}>
                            {products.map((product, index) => (
                                <div className="col-md-6 col-xl-4" key={product.productcode || `${product.productname}-${index}`} style={{ padding: '0.75rem' }}>
                                    <div
                                        className="h-100 border"
                                        style={{
                                            background: 'linear-gradient(135deg, #ffffff 0%, #f9fbff 100%)',
                                            borderColor: 'rgba(99, 102, 241, 0.16)',
                                            borderRadius: 22,
                                            boxShadow: '0 16px 40px rgba(15, 23, 42, 0.10)',
                                            minHeight: 190,
                                            padding: 24,
                                            margin: 4,
                                        }}
                                    >
                                        <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                                            <h6 className="mb-0 fw-bold text-dark">{product.productname || 'Unnamed Product'}</h6>
                                            <span className="badge rounded-pill" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                                                {product.productcode || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="text-muted small" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, fontSize: '0.95rem' }}>
                                            {product.productdetails || 'No description provided.'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
