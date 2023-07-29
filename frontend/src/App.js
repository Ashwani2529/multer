import React, { useState, useEffect } from 'react';

const App = () => {
  const [image, setImage] = useState();
  const [imagesList, setImagesList] = useState([]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("image", image);

    try {
      const response = await fetch('https://multer-3w57.onrender.com/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setImage(data.image);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchall = async () => {
    try {
      const response = await fetch("https://multer-3w57.onrender.com/fetchall", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      // console.log(json);
      setImagesList(json); 
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchall();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div>
        <h1>Image Uploader</h1>
        <form onSubmit={handleFormSubmit} action="/upload" method="post" encType="multipart/form-data">
          <div style={{ width: '300px', height: '300px', border: '1px solid #ccc' }}>
            {image ? (
              <img src={`https://multer-3w57.onrender.com/${image.imagePath}`} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              'Drag and drop an image here'
            )}
          </div>

          <input type="file" name="image" />
          <button type="submit">Upload</button>
        </form>
      </div>

      <h2 className="my-3">IMAGES</h2>
      <div className="row my-3">
        {imagesList.map((img) => (
          <img key={img._id} src={`https://multer-3w57.onrender.com/${img.imagePath}`} alt="Uploaded" style={{ width: '200px', height: '200px', objectFit: 'cover', margin: '10px' }} />
        ))}
      </div>
    </>
  );
};

export default App;
