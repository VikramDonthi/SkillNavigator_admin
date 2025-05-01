require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Models
const Job = require('./models/job');

// Authentication middleware
const requireLogin = (req, res, next) => {
  if (!req.session.loggedIn) {
    return res.redirect('/login');
  }
  next();
};

// Routes
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Login routes
app.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    return res.redirect('/');
  }
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    req.session.loggedIn = true;
    return res.redirect('/');
  }
  res.render('login', { error: 'Invalid credentials' });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// CRUD routes
app.get('/', requireLogin, async (req, res) => {
  try {
    const jobs = await Job.find();
    res.render('dashboard', { jobs });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/add', requireLogin, (req, res) => {
  res.render('edit', { job: null });
});

app.post('/save', requireLogin, async (req, res) => {
  try {
    const { id, title, sector, requiredSkills, companies, employabilityScore, recruitmentProcess } = req.body;
    
    const skillsArray = requiredSkills.split(',').map(skill => skill.trim());
    const companiesArray = companies.split(',').map(company => company.trim());
    const processArray = recruitmentProcess.split('\n').map(step => step.trim());
    
    const jobData = {
      title,
      sector,
      requiredSkills: skillsArray,
      companies: companiesArray,
      employabilityScore: parseInt(employabilityScore),
      recruitmentProcess: processArray
    };
    
    if (id) {
      await Job.findByIdAndUpdate(id, jobData);
    } else {
      await Job.create(jobData);
    }
    
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/edit/:id', requireLogin, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    res.render('edit', { job });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/delete/:id', requireLogin, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});