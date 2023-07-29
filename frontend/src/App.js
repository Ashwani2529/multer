import React, { useState, useEffect } from "react";
import {  ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const App = () => {
  const [image, setImage] = useState();
  const [imagesList, setImagesList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  function ctb64(e) {

    var r = new FileReader();
    r.readAsDataURL(e.target.files[0]);
    r.onload = () => {
      setImage(r.result);
      // e.target.value = "";
    };
    r.onerror = (error) => {
      console.log("Error", error);
    };
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const uploadPromise = fetch("http://localhost:3001/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          b64: image,
        }),
      });
  
      const [response] = await Promise.all([
        uploadPromise,
        toast.promise(
          uploadPromise,
          {
            pending: {
              render: "Uploading...",
              icon: false,
              autoClose: 1800,
            },
            success: {
              render: (data) => {
                setImage(data.image);
                
                return "Image Uploaded";
              },
              icon: "✔️", autoClose: 1800,
            },
            error: {
              render: (error) => {
                console.error(error);
                return "Failed to upload image";
              },
            },
          }
        ),
      ]);
  
      const data = await response.json();
      setImage(data.image);
      
      fetchall();
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image", {
        position: "top-right",
        autoClose: 1800,
        hideProgressBar: false,
        transition: "flip",
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };
  
  
  const fetchall = async () => {
    setIsFetching(true); 

    try {
      const response = await fetch("http://localhost:3001/fetchall", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();
      setImagesList(json);
      setIsFetching(false);
    } catch (error) {
      console.error(error.message);
      setIsFetching(false);
    }
  };
  const del = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/deletenote/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
 // eslint-disable-next-line
      const data = await response.json();
      toast.error('Deleted!', {
        position: "top-right",
        autoClose: 1800,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
      const updatedImagesList = imagesList.filter((img) => img._id !== id);
      setImagesList(updatedImagesList);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (isFetching) {
      const toastId = toast.info("Fetching images...", {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        hideProgressBar: true,
        closeButton: false,
      });
      return () => {
        toast.dismiss(toastId);
      };
    }
  }, [isFetching]);
  useEffect(() => {
    fetchall();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="box">
        <h1>Image Uploader</h1>
        <input accept="image/*" type="file" name="image" onChange={ctb64} />
        <button className="btn btn-primary" onClick={handleFormSubmit} type="submit">
          Upload
        </button>
        <ToastContainer />
      </div>

      <h2 id="he" className="row my-4">IMAGES</h2>
      <div className="row my-3 mx-2">
        {imagesList.map((img) => (
          <div key={img._id} className="container">
            <img className="imagebox"
              src={img.imageName}
              alt="Uploaded"
              style={{
                width: "300px",
                height: "300px",
                objectFit: "contain",
                margin: "2px",
              }}
            />
            <i id="trash"
              onClick={() => {
                del(img._id);
              }}
              className="bx bxs-trash-alt"
              style={{cursor: 'pointer'}}
            ></i>
          </div>
        ))}
        <ToastContainer/>
      </div>
    </>
  );
};

export default App;
