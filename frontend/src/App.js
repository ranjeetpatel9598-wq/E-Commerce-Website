import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function App() {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.name} added to cart!`);
  };

  const clearCart = () => setCart([]);

  return (
    <BrowserRouter>
      <nav style={{ padding: '15px 30px', background: '#2c3e50', color: 'white', display: 'flex', gap: '20px', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
        <h2 style={{ margin: 0, marginRight: '20px' }}>E-Shop</h2>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '18px' }}>Home</Link>
        <Link to="/cart" style={{ color: 'white', textDecoration: 'none', fontSize: '18px' }}>Cart ({cart.length})</Link>
        
        {!isLoggedIn ? (
          <Link to="/login" style={{ color: 'white', textDecoration: 'none', marginLeft: 'auto', fontSize: '18px' }}>Login / Register</Link>
        ) : (
          <span style={{ marginLeft: 'auto', cursor: 'pointer', fontSize: '18px', background: '#e74c3c', padding: '5px 10px', borderRadius: '5px' }} onClick={() => setIsLoggedIn(false)}>Logout</span>
        )}
      </nav>

      <div style={{ padding: '30px', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cart={cart} />} />
          <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} isLoggedIn={isLoggedIn} />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const Home = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');

  useEffect(() => {
    let url = 'http://localhost:5000/api/products';
    if (category) {
      url = url + `?category=${category}`;
    }

    axios.get(url)
      .then(response => setProducts(response.data))
      .catch(error => console.log("Error fetching products", error));
  }, [category]);

  return (
    <div>
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Browse Products</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Filter by Category: </label>
        <select onChange={(e) => setCategory(e.target.value)} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}>
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
        </select>
      </div>
      
      <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap' }}>
        {products.map((item) => (
          <div key={item._id} style={{ border: '1px solid #eaeaea', borderRadius: '10px', width: '250px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', backgroundColor: 'white' }}>
            <img src={item.image} alt={item.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div style={{ padding: '15px' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>{item.name}</h3>
              <p style={{ color: '#7f8c8d', margin: '0 0 10px 0', fontSize: '14px' }}>Category: {item.category}</p>
              <h4 style={{ margin: '0 0 15px 0', color: '#27ae60' }}>Price: ₹{item.price}</h4>
              <button onClick={() => addToCart(item)} style={{ width: '100%', padding: '10px', cursor: 'pointer', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Cart = ({ cart }) => {
  let totalPrice = 0;
  for (let i = 0; i < cart.length; i++) {
    totalPrice += cart[i].price;
  }

  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Your Shopping Cart</h2>
      {cart.length === 0 ? (
        <p style={{ fontSize: '18px', color: '#7f8c8d' }}>Cart is empty. Go back and add some products.</p>
      ) : (
        <div>
          {cart.map((item, index) => (
             <div key={index} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '15px 0', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }} />
                <strong style={{ fontSize: '18px' }}>{item.name}</strong>
              </div>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>₹{item.price}</span>
            </div>
          ))}
          <h3 style={{ textAlign: 'right', marginTop: '20px', fontSize: '24px' }}>Total Amount: ₹{totalPrice}</h3>
          <div style={{ textAlign: 'right' }}>
            <Link to="/checkout">
              <button style={{ padding: '12px 25px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

const Checkout = ({ cart, clearCart, isLoggedIn }) => {
  const navigate = useNavigate();

  const handlePayment = async () => {
    if (!isLoggedIn) {
      alert("Please login first to place an order!");
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/checkout');
      alert(response.data.message);
      clearCart();
      navigate('/');
    } catch (error) {
      alert("Payment failed!");
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', textAlign: 'center', border: '1px solid #ddd', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h2>Checkout Details</h2>
      <p style={{ fontSize: '18px' }}>Total items in cart: <strong>{cart.length}</strong></p>
      <button onClick={handlePayment} style={{ width: '100%', padding: '15px', background: '#e67e22', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', marginTop: '20px' }}>
        Complete Payment (Mock)
      </button>
    </div>
  );
};

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? '/api/register' : '/api/login';
    
    try {
      const response = await axios.post(`http://localhost:5000${endpoint}`, { email, password });
      if (response.data.success) {
        if (isRegistering) {
          alert("Registration Successful! Please login now.");
          setIsRegistering(false);
          setEmail('');
          setPassword('');
        } else {
          alert("Login successful!");
          setIsLoggedIn(true);
          navigate('/');
        }
      }
    } catch (error) {
      alert(error.response?.data?.error || error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div style={{ maxWidth: '350px', margin: 'auto', marginTop: '50px', border: '1px solid #ddd', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', backgroundColor: 'white' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>{isRegistering ? 'Create Account' : 'User Login'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }} />
        <button type="submit" style={{ padding: '12px', background: '#2c3e50', color: 'white', cursor: 'pointer', border: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '16px' }}>
          {isRegistering ? 'Register' : 'Login'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
        {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
        <span style={{ color: '#3498db', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Login here' : 'Register here'}
        </span>
      </p>
    </div>
  );
};

export default App;