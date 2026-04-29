import React, { useState, useEffect } from 'react';

const Home = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        setProducts([
            { _id: 1, name: "Laptop", price: 50000, category: "Electronics" },
            { _id: 2, name: "Headphones", price: 2000, category: "Accessories" }
        ]);
    }, []);

    return (
        <div>
            <h2>Latest Products</h2>
            <div className="product-grid">
                {products.map(product => (
                    <div key={product._id} className="card">
                        <h3>{product.name}</h3>
                        <p>Price: ₹{product.price}</p>
                        <button>Add to Cart</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
