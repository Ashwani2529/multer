const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
// const path = require('path');
const cors = require('cors');
// const router = express.Router();
const app = express();
const PORT = 3001;

// app.use(cors());
app.use(cors({
  origin:'https://main--glowing-semifreddo-32a44b.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Connect to MongoDB
mongoose.connect('mongodb+srv://ashwanix2749:brNEUnJl9b0N9LMF@cluster1.wsuyb84.mongodb.net/upload', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a schema and model for the uploaded image
const imageSchema = new mongoose.Schema({
  imageName: String,
  imagePath: String,
});

const Image = mongoose.model('Image', imageSchema);

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+"_"+file.originalname);
  },
});
const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), async (req, res) => {
  const newImage = new Image({
    imageName: req.file.filename,
    imagePath: req.file.path,
  });

  try {
    const image = await newImage.save();
    res.json({ message: 'Image uploaded successfully',"image": image });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to save image to the database' });
  }
});
app.get("/fetchall", async (req, res) => {
  try {
    // console.log("index ki 58 line");
    const img = await Image.find();
    // console.log(img);
    res.json(img);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});


// Route to serve uploaded images
app.use('/uploads', express.static('uploads'));
app.get("/", (req, res) => {
  return res.json( "hello i am 3001" );
});
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
// module.exports = router;