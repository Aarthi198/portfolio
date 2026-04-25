require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const EMAIL_USER = (process.env.EMAIL_USER || '').trim();
const EMAIL_PASS = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// Portfolio data
const portfolioData = {
  skills: [
    { name: 'UI/UX Design', icon: '🎨', description: 'Figma, Adobe XD, Prototyping' },
    { name: 'Frontend', icon: '💻', description: 'HTML, CSS, JavaScript, React' },
    { name: 'Backend', icon: '⚙️', description: 'Node.js, Express, MongoDB' },
    { name: 'Programming', icon: '📱', description: 'Python, Java, C++' },
    { name: 'Data Analytics', icon: '📊', description: 'Excel, Power BI, SQL' },
    { name: 'Canva Design', icon: '✏️', description: 'Social Media Graphics, Presentations' }
  ],
  projects: [
    { 
      name: 'FinTrack', 
      category: 'Web Development', 
      description: 'Personal finance tracking application',
      tech: ['React', 'Node.js', 'MongoDB'],
      link: 'https://github.com/aarthi35159/FinTrack'
    },
    { 
      name: 'Khet Kart', 
      category: 'Web Development', 
      description: 'Agricultural e-commerce platform',
      tech: ['HTML', 'CSS', 'JavaScript'],
      link: 'https://github.com/aarthi35159/Khet-Kart'
    },
    { 
      name: 'City Flood Watch', 
      category: 'Data Analytics', 
      description: 'Real-time flood monitoring system',
      tech: ['Python', 'Data Analytics'],
      link: 'https://github.com/aarthi35159/City-Flood-Watch'
    },
    { 
      name: 'Zidio', 
      category: 'Web Development', 
      description: 'Task management application',
      tech: ['React', 'Node.js'],
      link: 'https://github.com/aarthi35159/Zidio'
    },
    { 
      name: 'Smart Medicine Box', 
      category: 'IoT', 
      description: 'IoT-based medicine reminder system',
      tech: ['Arduino', 'Sensors'],
      link: 'https://github.com/aarthi35159/Smart-Medicine-Box'
    },
    { 
      name: 'Temperature Sensor', 
      category: 'IoT', 
      description: 'Temperature monitoring with alerts',
      tech: ['Arduino', 'IoT'],
      link: 'https://github.com/aarthi35159/Temperature-Sensor'
    },
    { 
      name: 'CODSOFT', 
      category: 'Web Development', 
      description: 'Landing page project',
      tech: ['HTML', 'CSS', 'JavaScript'],
      link: 'https://github.com/aarthi35159/CODSOFT'
    }
  ],
  about: {
    bio: 'I am a passionate developer and designer with expertise in creating beautiful, functional web applications. With hands-on experience through internships at leading tech companies, I bring a blend of technical skills and creative vision to every project.',
    stats: {
      internships: '3+',
      projects: '7+',
      years: '2+'
    },
    internships: [
      { company: 'Novitech', role: 'Web Development Intern', duration: '3 months' },
      { company: 'Zidio', role: 'Frontend Developer Intern', duration: '2 months' },
      { company: 'CODSOFT', role: 'Web Development Intern', duration: '1 month' }
    ]
  },
  social: {
    github: 'https://github.com/aarthi35159',
    linkedin: 'https://linkedin.com/in/aarthi35159'
  }
};

// API Routes

// Get all portfolio data
app.get('/api/portfolio', (req, res) => {
  res.json(portfolioData);
});

// Get skills
app.get('/api/skills', (req, res) => {
  res.json(portfolioData.skills);
});

// Get projects
app.get('/api/projects', (req, res) => {
  res.json(portfolioData.projects);
});

// Get about info
app.get('/api/about', (req, res) => {
  res.json(portfolioData.about);
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!EMAIL_USER || !EMAIL_PASS) {
    return res.status(500).json({
      error: 'Email service is not configured. Set EMAIL_USER and EMAIL_PASS environment variables.'
    });
  }

  // Configure nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });

  const mailOptions = {
    from: EMAIL_USER,
    replyTo: email,
    to: EMAIL_USER,
    subject: `Portfolio Contact: ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    if (error.responseCode === 535) {
      res.status(500).json({ error: 'Gmail authentication failed. You need an App Password. Go to your Google Account → Security → 2-Step Verification → App Passwords' });
    } else {
      res.status(500).json({ error: 'Failed to send message' });
    }
  }
});

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});