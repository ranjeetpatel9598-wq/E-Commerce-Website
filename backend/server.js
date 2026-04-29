require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce_assignment";

mongoose.connect(mongoURI)
  .then(() => console.log("Database connected successfully!"))
  .catch((err) => console.log("Database error:", err));

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  image: String
});
const Product = mongoose.model('Product', ProductSchema);

app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const newUser = new User({ email, password });
    await newUser.save();
    res.json({ success: true, message: "Registration successful! You can login now." });
  } catch (error) {
    res.status(400).json({ success: false, error: "Email already exists or invalid data" });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  // .env se secret key use karne ka logic yahan handle ho sakta hai agar aap JWT use kar rahe hon
  const user = await User.findOne({ email: email, password: password });
  
  if (user) {
    res.json({ success: true, message: "Login successful!" });
  } else {
    res.status(401).json({ success: false, message: "Wrong email or password" });
  }
});

app.get('/api/products', async (req, res) => {
  const categoryFilter = req.query.category;
  
  const dummyProducts = [
    { _id: '1', name: 'MacBook Air', price: 80000, category: 'Electronics', image: 'https://dummyimage.com/400x300/e0e0e0/000000.png&text=MacBook+Air' },
    { _id: '2', name: 'Nike Sneakers', price: 2500, category: 'Fashion', image: 'https://dummyimage.com/400x300/e0e0e0/000000.png&text=Sneakers' },
    { _id: '3', name: 'Sony Headphones', price: 1500, category: 'Electronics', image: 'https://dummyimage.com/400x300/e0e0e0/000000.png&text=Headphones' },
    { _id: '4', name: 'Denim Jacket', price: 1200, category: 'Fashion', image: 'https://dummyimage.com/400x300/e0e0e0/000000.png&text=Denim+Jacket' }
  ];

  if (categoryFilter) {
    const filtered = dummyProducts.filter(p => p.category === categoryFilter);
    return res.json(filtered);
  }
  
  res.json(dummyProducts);
});

app.post('/api/checkout', (req, res) => {
  res.json({ success: true, message: "Payment successful! Order placed." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});