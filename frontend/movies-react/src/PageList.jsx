import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
// import Header from "./Header.jsx"
// import Footer from "./Footer.jsx"

const INITIAL_PAGE = 1;
const END_PAGE = 20;
const PRODUCTS_PER_PAGE = 3;

// var express = require("express");
// var cors = require("cors");
// var app = express();
// app.use(cors({ origin: true, credentials: true }));

function PageList({movieList, currentPage, setCurrentPage, filters, setFilters}) {
  return (<div className="container">
    <h2>Movies</h2>
    <Filters
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      filters={filters}
      setFilters={setFilters}
    />
    <MovieList movieList={movieList}/>
  </div>);
}


function Filters({
  currentPage,
  setCurrentPage,
  filters,
  setFilters
}) {
  const {title, description, genre, minRating} = filters;
  const {setTitle, setDescription, setGenre, setMinRating} = setFilters;
  return (<>
    <div className="buttons">
      <PageFilter currentPage={currentPage} setCurrentPage={setCurrentPage}/>
      <TitleFilter title={title} setTitle={setTitle}/>
      {/* <RatingFilter minRating={minRating} setMinRating={setMinRating}/> */}
    </div>
  </>);
}

function PageFilter({currentPage, setCurrentPage}) {
  function changePage(page) {
    page = Math.max(INITIAL_PAGE, page);
    page = Math.min(page, END_PAGE);
    setCurrentPage(page);
  }
  return (
    <div className="PageFilter">
      <button onClick={() => changePage(currentPage - 1)} disabled={currentPage===INITIAL_PAGE}>&lt;</button>
      <input type="number" value={currentPage} onChange={(e) => changePage(e.target.value)}/>
      <button onClick={() => changePage(currentPage + 1)} disabled={currentPage===END_PAGE}>&gt;</button>
    </div>
  );
}

function TitleFilter({title, setTitle}) {
  function changeTitle(newTitle) {
    setTitle(newTitle);
  }
  return (
    <div className="TitleFilter">
      <p>
        <input type="text" value={title} onChange={(e) => changeTitle(e.target.value)} placeholder="Title"/>
      </p>
    </div>
  );
}

function RatingFilter({minRating, setMinRating}) {
  function changeMinRating(minStock) {
    minRating = Math.max(0, minRating);
    setMinRating(minStock);
  }
  return (
    <div className="MinRatingFilter">
      <p>
        <input type="number" value={minRating} onChange={(e) => changeMinRating(e.target.value)} placeholder="Minimum Rating"/>
      </p>
    </div>
  );
}


function MovieList({movieList, minStock}) {
  return (<div>
    {movieList.map(movie => 
      // Remove the link appearance
      // Add unique key to each film
      <NavLink to={`/films/${movie.id}`} key={movie.id} style={{textDecoration: 'none', color: 'black'}}>
        <Movie movie={movie}/>
      </NavLink>)}
  </div>);
}

function Movie({movie}) {
  return (
    <div className="movie-details" id="movieDetails">
      <img src={movie.image_url} alt="Thumbnail" id="thumbnail"/>
      <div className="info">
        <h2>{movie.title}</h2>
        {/* <p>{movie.description}</p> */}
        <p>
          <strong>Genre:</strong> <span>{movie.genre}</span>
        </p>
        <p>
          <strong>Director:</strong> <span>{movie.director}</span>
        </p>
        <p>
          <strong>Release Year:</strong> <span>{movie.release_year}</span>
        </p>
        <p>
          <strong>Rating:</strong> <span>{movie.global_rating}</span>
        </p>
      </div>
    </div>
  );
}

function App() {
  const [movieList, setMovieList] = useState([]);
  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [minRating, setMinRating] = useState(1);

  const filters = {
    title: title,
    description: description,
    genre: genre,
    minRating: minRating
  };
  const setFilters = {
    setTitle: setTitle,
    setDescription: setDescription,
    setGenre: setGenre,
    setMinRating: setMinRating
  };

  useEffect(() => {
    let skip = (currentPage - INITIAL_PAGE) * PRODUCTS_PER_PAGE;
    const fetchMovies = async () => {
      try {
        // Content type application json
        const response = await fetch(`http://127.0.0.1:8000/api/films/all/`);
        if (!response.ok) {
          throw new Error('Could not find the list');
        } 
        const data = await response.json();
        console.log("Data received from json", data)
        
        // Apply Filters to data
        data = data.filter(movie => 
          movie.title.toLowerCase().includes(filters.title.toLowerCase())
        );
        data = data.filter(movie => 
          movie.description.toLowerCase().includes(filters.description.toLowerCase())
        );
        data = data.filter(movie => 
          movie.genre.toLowerCase().includes(filters.genre.toLowerCase())
        );
        // data = data.filter(movie => {
        //   return movie.global_rating >= filters.minRating;
        // });


        // Set the Movie List to the data fetched from the API
        setMovieList(data);
      } catch (error) {
        console.error('Error while obtaining the list:', error);
      }
    };

    fetchMovies();
  }, [currentPage, minRating]);

  return (
      // <Header/>
      <PageList
        movieList={movieList}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        filters={filters}
        setFilters={setFilters}
      />
      // <Footer/>
  )
}

export default App
