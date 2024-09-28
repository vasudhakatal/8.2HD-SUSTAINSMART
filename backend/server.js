const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection (using environment variables)
const mongoURI = "mongodb+srv://katalvasudha26:password26@cluster0.md9ls.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/food');

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
