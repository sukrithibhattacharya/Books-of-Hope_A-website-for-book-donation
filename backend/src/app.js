const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 200;
const multer = require("multer");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const fs = require('fs');

// Import models
const BookDonation = require("./models/BookDonation");
const FeaturedCampaign = require("./models/featuredCampaign");
const Donor = require('./models/Donor');
const Ngo = require('./models/Ngo');
const Institute = require('./models/Institute');
const Student = require('./models/Student');
const Book = require("./models/book"); 

// MongoDB connection
require("./db/conn");

// Set up static file serving
const static_path = path.join(__dirname, "../public");
app.use(express.static(static_path));

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add this for JSON request parsing

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../public/uploads');
    
    // Ensure the directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Save the file to the uploads folder
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Use a unique suffix to avoid name conflicts
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);  // Retain the original file extension
    cb(null, uniqueSuffix + ext);  // Generate a unique name for the file
  }
});

// File filter to allow only jpeg and png images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  
  // Check if file mimetype matches allowed types
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);  // File type is allowed
  } else {
    cb(new Error('Only JPEG and PNG images are allowed!'), false);  // Reject file
  }
};

// Multer setup with the storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});

// Book donation route
app.post('/donate-book', upload.single('coverImage'), async (req, res) => {
  try {
    console.log("Received book donation:", req.body);
    console.log("File:", req.file);
    
    // Create new book donation object
    const newDonation = new BookDonation({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone || "",
      bookTitle: req.body.bookTitle,
      author: req.body.author,
      genre: req.body.genre,
      ageGroup: req.body.ageGroup,
      condition: req.body.condition,
      description: req.body.description || "",
      
      // Set the path of the uploaded file
      coverImagePath: req.file ? `/uploads/${req.file.filename}` : null,
      
      // Default status is "Available"
      status: 'Available',
      
      // Auto-approve for now (you can change this later)
      approved: true
    });
    
    // Save to database
    const savedDonation = await newDonation.save();
    console.log("Donation saved:", savedDonation);
    
    // Redirect to a thank you page or back to the home page
    res.redirect('/thankyou.html');  // Ensure this file exists in your public directory
  } catch (error) {
    console.error('Donation submission error:', error);
    res.status(500).send("There was an error submitting your donation. Please try again.");
  }
});

// API route to get all books for browse page
app.get('/api/books', async (req, res) => {
  try {
    console.log("Fetching books...");
    const books = await BookDonation.find().sort({ donationDate: -1 });
    
    // Format the response for the frontend
    const formattedBooks = books.map(book => ({
      id: book._id,
      title: book.bookTitle || "Unknown Title",
      author: book.author || "Unknown Author",
      genre: book.genre || "Uncategorized",
      ageGroup: book.ageGroup || "All Ages",
      status: book.status || "Unknown",
      coverUrl: book.coverImagePath || null
    }));
    
    console.log(`Found ${formattedBooks.length} books`);
    res.json(formattedBooks);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching books', 
      error: error.message 
    });
  }
});

// POST route to handle featured campaign form submissions
app.post("/donate-featured", upload.single('book-file'), async (req, res) => {
    try {
        const { name, email, books, campaignName } = req.body;
        const bookFilePath = req.file ? req.file.path : null;

        const newFeaturedCampaign = new FeaturedCampaign({
            name,
            email,
            books,
            campaignName,
            bookFilePath
        });

        await newFeaturedCampaign.save();
        res.send("Thank you for donating to the featured campaign!");
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("An error occurred while processing your donation.");
    }
});

// Donor registration
app.post('/donor-register', async (req, res) => {
    const { name, email, contact, username, password } = req.body;
  
    try {
      const existingDonor = await Donor.findOne({ $or: [{ email }, { username }] });
      if (existingDonor) {
        return res.status(400).send('Email or Username is already registered.');
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newDonor = new Donor({ name, email, contact, username, password: hashedPassword });
      await newDonor.save();
  
      res.status(201).send('Donor registered successfully.');
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).send('Server error. Please try again.');
    }
});

// NGO registration
app.post('/ngo-register', async (req, res) => {
    const { name, registrationNumber, address, email, contact, username, password } = req.body;
  
    try {
      const existingNgo = await Ngo.findOne({ $or: [{ email }, { username }] });
      if (existingNgo) {
        return res.status(400).send('Email or Username is already registered.');
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newNgo = new Ngo({ name, registrationNumber, address, email, contact, username, password: hashedPassword });
      await newNgo.save();
  
      res.status(201).send('Ngo registered successfully.');
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).send('Server error. Please try again.');
    }
});
  
// Institute registration
app.post('/institute-register', async (req, res) => {
    const { name, registrationNumber, address, email, phone, username, password } = req.body;
  
    try {
      const existingInstitute = await Institute.findOne({ $or: [{ email }, { username }] });
      if (existingInstitute) {
        return res.status(400).send('Email or Username already exists.');
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newInstitute = new Institute({
        name,
        registrationNumber,
        address,
        email,
        phone,
        username,
        password: hashedPassword
      });
  
      await newInstitute.save();
      res.status(201).send('Institute registered successfully.');
    } catch (error) {
      console.error('Institute registration error:', error);
      res.status(500).send('Server error.');
    }
});
  
// Student registration
app.post('/student-register', async (req, res) => {
    const {
      'stu-name': name,
      'stu-id': studentId,
      'stu-email': email,
      'stu-phone': phone,
      'stu-course': course,
      'username': username,
      'password': password
    } = req.body;
  
    try {
      const existingStudent = await Student.findOne({ $or: [{ email }, { username }] });
      if (existingStudent) {
        return res.status(400).send('Email or Username already exists.');
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newStudent = new Student({
        name,
        studentId,
        email,
        phone,
        course,
        username,
        password: hashedPassword
      });
  
      await newStudent.save();
      res.status(201).send('Student registered successfully.');
    } catch (error) {
      console.error('Student registration error:', error);
      res.status(500).send('Server error.');
    }
});
  
// Donor Login
app.post('/login-donor', async (req, res) => {
  const { username, password } = req.body;
  try {
    const donor = await Donor.findOne({ username });
    if (!donor) return res.status(400).send("Username not found");

    const isMatch = await bcrypt.compare(password, donor.password);
    if (!isMatch) return res.status(400).send("Incorrect password");

    res.send("Donor login successful");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error");
  }
});

// NGO Login
app.post('/login-ngo', async (req, res) => {
  const { username, password } = req.body;
  try {
    const ngo = await Ngo.findOne({ username });
    if (!ngo) return res.status(400).send("Username not found");

    const isMatch = await bcrypt.compare(password, ngo.password);
    if (!isMatch) return res.status(400).send("Incorrect password");

    res.send("NGO login successful");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error");
  }
});

// Institute Login
app.post('/login-edu-institute', async (req, res) => {
  const { username, password } = req.body;
  try {
    const institute = await Institute.findOne({ username });
    if (!institute) return res.status(400).send("Username not found");

    const isMatch = await bcrypt.compare(password, institute.password);
    if (!isMatch) return res.status(400).send("Incorrect password");
    
    res.send("Institute login successful");
  } catch (err) {
    console.error("Institute login error:", err);
    res.status(500).send("Server error");
  }
});

// Student Login
app.post('/login-student', async (req, res) => {
  const { username, password } = req.body;
  try {
    const student = await Student.findOne({ username });
    if (!student) return res.status(400).send("Username not found");

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).send("Incorrect password");
    
    res.send("Student login successful");
  } catch (err) {
    console.error("Student login error:", err);
    res.status(500).send("Server error");
  }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
