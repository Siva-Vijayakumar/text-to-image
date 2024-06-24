import express from 'express';
import path from 'path';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url'; 

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

// Unsplash API configuration
const unsplashAccessKey = 'EksLczghCF6rW6Y-0UDAh1EDIgWIxi4pl5eqBUR5-vE'; // Replace with your Unsplash Access Key
const unsplashApiUrl = 'https://api.unsplash.com/search/photos';

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the directory for views (EJS templates)
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Route to render the index.ejs file with the form
app.get('/', (req, res) => {
  res.render('index', { images: null });
});

// Route to handle form submission and fetch images from Unsplash
app.post('/search', async (req, res) => {
  const query = req.body.query;

  try {
    // Fetch images from Unsplash API based on user input query
    const response = await fetch(`${unsplashApiUrl}?query=${query}&client_id=${unsplashAccessKey}`);
    const data = await response.json();

    // Extract relevant image information from API response
    const images = data.results.map(result => ({
      imageUrl: result.urls.regular,
      photographerName: result.user.name,
      photographerLink: result.user.links.html
    }));

    // Render the index.ejs template with image data
    res.render('index', { images });
  } catch (error) {
    console.error('Error fetching images from Unsplash API:', error.message);
    res.status(500).send('Error fetching images');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
