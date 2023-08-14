const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(express.json({ limit: '25mb' }));

app.use(cors({
  origin: 'https://image-upload69.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

mongoose.connect('mongodb+srv://ashwanix2749:tj94HXLQAcOB6XJK@cluster1.wsuyb84.mongodb.net/upload', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const imageSchema = new mongoose.Schema({
  imageName: String,
  imagePath: String,
});

const Image = mongoose.model('Image', imageSchema);

app.delete("/deletenote/:id", async (req, res) => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id);
    if (!image) {
      return res.status(404).send("Image not found");
    }

    res.json({ msg: "Image Deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

app.get("/fetchall", async (req, res) => {
  try {
    const img = await Image.find();
    res.json(img);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});
app.post('/upload', async (req, res) => {
 const {b64}=req.body;

  try {
    const image=await Image.create({imageName:b64});
    res.json({ message: 'Image uploaded successfully',"image": image });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to save image to the database' });
  }
});

app.get("/", (req, res) => {
  return res.json( "hello i am 3001" );
});
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});