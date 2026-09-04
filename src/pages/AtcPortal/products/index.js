import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBoxOpen,
    faCircleExclamation,
    faPlus,
    faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';
import API_URL from '../../../config';

const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" }) : "—";

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
        <div className="products-page">
            <div className="pp-head">
                <div className="pp-head-left">
                    <span className="pp-ic" aria-hidden="true"><FontAwesomeIcon icon={faBoxOpen} /></span>
                    <div>
                        <div className="pp-eyebrow">Catalogue</div>
                        <h1 className="pp-title">Products</h1>
                        <div className="pp-sub">All products available for your transactions and reports.</div>
                    </div>
                </div>
                <div className="pp-head-right">
                    <span className="pp-count">{products.length} {products.length === 1 ? "product" : "products"}</span>
                    <Link to="/atcportal/addproduct" className="pp-add-btn">
                        <FontAwesomeIcon icon={faPlus} /> Add Product
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="pp-grid">
                    {[0, 1, 2].map((i) => (
                        <div className="pp-card pp-skeleton" key={i} aria-hidden="true">
                            <div className="pp-top">
                                <span className="pp-tile pp-tile-skel" />
                                <span className="pp-skel-line" style={{ width: "55%" }} />
                            </div>
                            <span className="pp-skel-line" style={{ width: "100%" }} />
                            <span className="pp-skel-line" style={{ width: "85%" }} />
                            <span className="pp-skel-line" style={{ width: "60%" }} />
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="pp-banner pp-err-bg">
                    <FontAwesomeIcon icon={faCircleExclamation} />
                    {error}
                </div>
            ) : products.length === 0 ? (
                <div className="pp-empty">
                    <span className="pp-empty-ic" aria-hidden="true"><FontAwesomeIcon icon={faBoxOpen} /></span>
                    <div className="pp-empty-title">No products yet</div>
                    <div className="pp-empty-sub">Add your first product to start using it in transactions and reports.</div>
                    <Link to="/atcportal/addproduct" className="pp-add-btn"><FontAwesomeIcon icon={faPlus} /> Add Product</Link>
                </div>
            ) : (
                <div className="pp-grid">
                    {products.map((product, index) => (
                        <div className="pp-card" key={product.productcode || `${product.productname}-${index}`}>
                            <div className="pp-top">
                                <span className="pp-tile" aria-hidden="true"><FontAwesomeIcon icon={faBoxOpen} /></span>
                                <div className="pp-name-wrap">
                                    <div className="pp-name" title={product.productname}>
                                        {product.productname || 'Unnamed Product'}
                                    </div>
                                    <div className="pp-code">{product.productcode || 'N/A'}</div>
                                </div>
                            </div>
                            <div className="pp-desc">
                                {product.productdetails || 'No description provided.'}
                            </div>
                            <div className="pp-foot">
                                <span className="pp-added">
                                    <FontAwesomeIcon icon={faCalendarAlt} /> Added {fmtDate(product.createdAt)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
