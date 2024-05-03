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

function ListPage({movieList, currentPage, setCurrentPage, minStock, setMinStock}) {
  return (<div className="container">
    <h2>Nuestros Productos</h2>
    <Filters
      movieList={movieList}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      minStock={minStock}
      setMinStock={setMinStock}
    />
    <MovieList productList={movieList} minStock={minStock}/>
  </div>);
}


function Filters({
  currentPage,
  setCurrentPage,
  minStock,
  setMinStock
}) {

  function changePage(page) {
    page = Math.max(INITIAL_PAGE, page);
    page = Math.min(page, END_PAGE);
    setCurrentPage(page);
  }

  function changeMinStock(minStock) {
    minStock = Math.max(0, minStock);
    setMinStock(minStock);
  }

  return (<>
    <div className="buttons">
      <div className="PageFilter">
        <button onClick={() => changePage(currentPage - 1)} disabled={currentPage===INITIAL_PAGE}>&lt;</button>
        <input type="number" value={currentPage} onChange={(e) => changePage(e.target.value)}/>
        <button onClick={() => changePage(currentPage + 1)} disabled={currentPage===END_PAGE}>&gt;</button>
      </div>
      <div className="StockFilter">
        <p>Stock Minimon
          <input type="number" value={minStock} onChange={(e) => changeMinStock(e.target.value)} placeholder="Minimum Stock"/>
        </p>
      </div>
    </div>
  </>);
}

function MovieList({productList: movieList, minStock}) {
  return (<div>
    {movieList.map(movie => 
      // Remove the link appearance
      // Add unique key to each film
      <NavLink to={`/films/${movie.title}`} key={movie.title} style={{textDecoration: 'none', color: 'black'}}>
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
        <p>{movie.description}</p>
        <p>
          <strong>Genre:</strong> <span>{movie.genre}</span>
        </p>
        <p>
          <strong>Director:</strong> <span>{movie.director}</span>
        </p>
        <p>
          <strong>Release Year:</strong> <span>{movie.release_year}</span>
        </p>
      </div>
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);
  const [movieList, setMovieList] = useState([]);
  const [minRating, setMinRating] = useState(1);

  useEffect(() => {
    let skip = (currentPage - INITIAL_PAGE) * PRODUCTS_PER_PAGE;
    const fetchMovies = async () => {
      try {
        // Set the request mode to 'no-cors' to fetch the data from the API
        // Content type application json
        const response = await fetch(`http://127.0.0.1:8000/api/films/all/`);
        if (!response.ok) {
          throw new Error('Could not find the list');
        } 
        const data = await response.json();
        console.log(data);
        
        // Set the Movie List to the data fetched from the API
        setMovieList(data);

        // setProductList(data.products);
      } catch (error) {
        console.error('Error while obtaining the list:', error);
      }
    };

    fetchMovies();
  }, [currentPage, minRating]);

  return (
      // <Header/>
      <ListPage
        movieList={movieList}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        minStock={minRating}
        setMinStock={setMinRating}
      />
      // <Footer/>
  )
}

export default App
