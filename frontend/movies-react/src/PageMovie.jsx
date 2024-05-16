import React from 'react';
import { useState, useEffect } from 'react';
import { useLoaderData } from "react-router-dom";
import { Rating } from 'react-simple-star-rating'
import { getIsLoggedIn } from './Header';
import { getProfileData } from './PageProfile';

export default function PageMovie() {
  let movie = useLoaderData();
  
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
          <StarComponent />
        </div>
      </div>
    </div>
  )
};

function StarComponent() {
  const [rating, setRating] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(null)
  const [profileData, setProfileData] = useState({})

  useEffect(() => {
    getIsLoggedIn({ setIsLoggedIn});
    getProfileData({ setProfileData });
  }, []);

  // Catch Rating value
  const handleRating = (rate) => {
    if (isLoggedIn) {
      setRating(rate)
      // Get film ID from URL
      const url = window.location.href;
      const movieId = parseInt(url.substring(url.lastIndexOf('/') + 1));
      postRating({ movieId, profileData, rating: rate });
    }
  }

  return (
    <div className='App'>
      {/* If isLoggedIn, show "Set Your own Rating" if not, "Log In to set your own rating*/}
      <h4>
        {isLoggedIn ? "Set Your own Rating" : "Log In to set your own rating"}
      </h4>
      <div className="rating-container">
        <Rating onClick={handleRating}/>
      </div>
    </div>
  )
}

async function postRating({ movieId, profileData, rating}) {
  console.log(profileData.id, movieId, rating)
  const registerResponse = await fetch(`http://127.0.0.1:8000/api/films/ratings/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({film: movieId, user: profileData.id, rating}),
      });
  return registerResponse;
}

