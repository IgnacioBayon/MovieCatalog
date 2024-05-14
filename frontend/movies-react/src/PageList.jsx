import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
// import Header from "./Header.jsx"
// import Footer from "./Footer.jsx"

const INITIAL_PAGE = 1;
const END_PAGE = 20;
const PRODUCTS_PER_PAGE = 3;


function PageList({movieList, currentPage, setCurrentPage}) {
  return (<div className="container">
    <h2>Movies</h2>
    <Filters
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
    <MovieList movieList={movieList}/>
  </div>);
}


function Filters({
  currentPage,
  setCurrentPage,
}) {
  return (<>
    <div className="buttons">
      <PageFilter currentPage={currentPage} setCurrentPage={setCurrentPage}/>
    </div>
  </>);
}


function MovieList({movieList}) {
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
        <p><strong>Genre:</strong> <span>{movie.genre}</span></p>
        <p><strong>Director:</strong> <span>{movie.director}</span></p>
        <p><strong>Release Year:</strong> <span>{movie.release_year}</span></p>
        <p><strong>Rating:</strong> <span>{movie.global_rating}</span></p>
      </div>
    </div>
  );
}

function App() {
  const [movieList, setMovieList] = useState([]);
  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);

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

        // Set the Movie List to the data fetched from the API
        setMovieList(data);
      } catch (error) {
        console.error('Error while obtaining the list:', error);
      }
    };

    fetchMovies();
  }, [currentPage, minRating]);

  return (
      <PageList
        movieList={movieList}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
  )
}

export default App
