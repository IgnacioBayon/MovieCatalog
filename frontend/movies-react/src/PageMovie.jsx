import React from 'react';
import { useLoaderData } from "react-router-dom";
// import { useState, useEffect } from 'react';

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
          <p><strong>Rating:</strong> <span>{movie.global_rating}</span></p>
        </div>
      </div>
    </div>
  )
};

