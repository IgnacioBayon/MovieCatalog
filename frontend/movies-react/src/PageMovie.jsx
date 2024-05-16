import React from 'react';
import { useState, useEffect } from 'react';
import { useLoaderData } from "react-router-dom";
import { Rating } from 'react-simple-star-rating'

export default function PageMovie() {
  const movie = useLoaderData();

  const [rating, setRating] = useState(0)
  const [profileData, setProfileData] = useState({})

  useEffect(() => {
    const initialize = async () => {
      await getProfileData({ setProfileData });
    };
    initialize();
  }, []);

  useEffect(() => {
    const movieId = movie.id;
    if (profileData.id) {
      getRating({ setRating, movieId, profileData });
    }
  }, [profileData]);
  
  return (
    <div className="container">
      <div className="movie-details" id="movieDetails">
        <img src={movie.image_url} alt="image_url" id="image_url"/>
        <div className="info">
          <h2>{movie.title}</h2>
          <p>{movie.description}</p>
          <p><strong>Genre:</strong> <span>{movie.genre}</span></p>
          <p><strong>Director:</strong> <span>{movie.director}</span></p>
          <p><strong>Release Year:</strong> <span>{movie.release_year}</span></p>
          <p><strong>Avg. Rating:</strong> <span>{movie.global_rating}</span></p>
          <StarComponent 
            movieId={movie.id}
            profileData={profileData}
            rating={rating}
            setRating={setRating}
          />
        </div>
      </div>
    </div>
  )
};

function StarComponent({ movieId, profileData, rating, setRating }) {
  
  // Catch Rating value
  const handleRating = (rate) => {
    if (profileData.id) {
      setRating(rate)
      // Get film ID from URL
      postRating({ movieId, profileData, rating: rate });
    }
  }

  return (
    <div className='App'>
      <h4>
        {(profileData.id) ? 
          (rating === 0) ? "Set your own rating" : "Change Your rating"
          : "Log in to set your own rating"
        }
      </h4>
      <div className="rating-container" style={{display: profileData.id ? '' : 'none'}}>
        <Rating initialValue={rating} onClick={handleRating}/>
      </div>
    </div>
  )
}

async function getRating({ setRating, movieId, profileData }) {
  const response = await fetch(`http://127.0.0.1:8000/api/films/ratings/all/?film=${movieId}&user=${profileData.id}`);
  if (!response.ok) {
    setRating(0);
    return
  }
  const data = await response.json();
  setRating(data[0].rating);
}

async function postRating({ movieId, profileData, rating}) {
  const registerResponse = await fetch('http://127.0.0.1:8000/api/films/ratings/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({film: movieId, user: profileData.id, rating}),
      });
  console.log("registerResponse", registerResponse.ok)
  if (registerResponse.ok) {
    window.location.reload();
  }
  return registerResponse;
}

// ///////////////////////////////////////////////////////////

async function getProfileData({ setProfileData }) {
  const response = await fetch("http://127.0.0.1:8000/api/users/me/", {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
      },
      credentials: "include",
  });
  const data = await response.json();
  setProfileData(data);

}