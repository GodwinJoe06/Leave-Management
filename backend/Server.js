const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/leave_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then (() => {
  console.log("Mongodb Successfully Connected")
}).catch((err) => {
  console.log("MongoDB Error : ",err)
})

const leaveSchema = new mongoose.Schema({
  reason: String,
  status: String,
  required_date : Date,
});

const Leave = mongoose.model('Leave', leaveSchema);

// Create a new leave
app.post('/leave', async (req, res) => {
  const newLeave = new Leave(req.body);
  await newLeave.save();
  res.json(newLeave);
});

app.get('/admin', async (req, res) => {
  const leaves = await Leave.find();
  res.json(leaves);
});

// Update a leave
app.put('/admin/:id', async (req, res) => {
  const leave = await Leave.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(leave);
});

// Get all leaves
app.get('/leave', async (req, res) => {
  const leaves = await Leave.find();
  res.json(leaves);
});

// Update a leave
app.put('/leave/:id', async (req, res) => {
  const leave = await Leave.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(leave);
});

// Delete a leave
app.delete('/leave/:id', async (req, res) => {
  await Leave.findByIdAndDelete(req.params.id);
  res.send('Leave Application deleted');
});

const loginSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const login = mongoose.model('Login', loginSchema);

// Add this code after your existing imports and middleware setup

// Login route
app.post('/login', async (req, res) => {
const { username, password } = req.body;

try {
  // Find the user in the database
  const user = await login.findOne({ username });

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }

  if (user.password === password) {
    return res.status(200).json({ message: 'Login successful!' });
  } else {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }
} catch (error) {
  console.error('Error logging in:', error);
  return res.status(500).json({ message: 'Server error. Please try again later.' });
}
});

app.listen(5001, () => {
  console.log('Server is running on port 5001');
});
