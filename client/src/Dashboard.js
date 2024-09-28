import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Dashboard.css"; // Ensure this file exists

function Dashboard() {
  const [name, setName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [foodList, setFoodList] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchFoodList();
    checkUserRole();
  }, []);

  const checkUserRole = () => {
    const token = localStorage.getItem('token');
    if (token) {
      // Simulated role check; replace with actual logic
      const userRole = "admin"; // Change this based on actual user role
      setIsAdmin(userRole === 'admin');
    }
  };

  const fetchFoodList = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/food', {
        headers: { 'x-auth-token': token },
      });
      setFoodList(response.data);
    } catch (err) {
      console.log(err.response.data.msg);
    }
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:5000/api/food/add',
        { name, expiryDate, quantity },
        { headers: { 'x-auth-token': token } }
      );
      alert('Food added!');
      fetchFoodList();
      setName('');
      setExpiryDate('');
      setQuantity('');
    } catch (err) {
      console.log(err.response.data.msg);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>{isAdmin ? 'Add Food' : 'Food List'}</h2>

      {isAdmin && (
        <form className="food-form" onSubmit={handleAddFood}>
          <input
            type="text"
            placeholder="Food Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Expiry Date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
          <button type="submit">Add Food</button>
        </form>
      )}

      <h3>Food Items:</h3>
      <ul className="food-list">
        {foodList.map((food, index) => (
          <li key={index}>
            <strong>{food.name}</strong> - Expiry: {food.expiryDate} - Quantity: {food.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
