import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
// import Header from "./Header.jsx"
// import Footer from "./Footer.jsx"

const INITIAL_PAGE = 1;
const END_PAGE = 20;
const PRODUCTS_PER_PAGE = 3;


function PageList({movieList, currentPage, setCurrentPage, filters, setFilters}) {
  return (<div className="container">
    <h2>Movies</h2>
    <Filters
      filters={filters}
      setFilters={setFilters}
    />
    <MovieList movieList={movieList}/>
    <PageFilter currentPage={currentPage} setCurrentPage={setCurrentPage}/>
  </div>);
}

function Filters({ filters, setFilters }) {
  const {title, description, genre, rating} = filters;
  const {setTitle, setDescription, setGenre, setRating} = setFilters;
  return (<>
    <div className = "filters-container">
      <h3 id="filters">Filters</h3>
      <div className="filters">
        <TitleFilter title={title} setTitle={setTitle}/>
        <DescriptionFilter description={description} setDescription={setDescription}/>
        <GenreFilter genre={genre} setGenre={setGenre}/>
        <RatingFilter rating={rating} setRating={setRating}/>
      </div>
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
      <p>{currentPage}</p>
      {/* <input type="number" value={currentPage} onChange={(e) => changePage(e.target.value)}/> */}
      <button onClick={() => changePage(currentPage + 1)} disabled={currentPage===END_PAGE}>&gt;</button>
    </div>
  );
}

function TitleFilter({title, setTitle}) {
  return (
    <div className="TitleFilter">
      <p>
        <strong>Title<br/></strong>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title"/>
      </p>
    </div>
  );
}

function DescriptionFilter({description, setDescription}) {
  return (
    <div className="DescriptionFilter">
      <p>
        <strong>Description<br/></strong>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description"/>
      </p>
    </div>
  );
}

function GenreFilter({genre, setGenre}) {
  return (
    <div className="GenreFilter">
      <p>
        <strong>Genre<br/></strong>
        <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Genre"/>
      </p>
    </div>
  );
}


function RatingFilter({rating, setRating}) {
  return (
    <div className="MinRatingFilter">
      <p>
        <strong>Minimum Rating<br/></strong>
        <input type="number" value={rating} onChange={(e) => setRating(Math.max(0, Math.min(e.target.value, 5)))} placeholder="Minimum Rating"/>
      </p>
    </div>
  );
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
        <h3>{movie.title}</h3>
        <p><strong>Genre:</strong> <span>{movie.genre}</span></p>
        <p><strong>Director:</strong> <span>{movie.director}</span></p>
        <p><strong>Release Year:</strong> <span>{movie.release_year}</span></p>
        <p><strong>Avg. Rating:</strong> <span>{movie.global_rating}</span></p>
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
  const [rating, setRating] = useState(0);
  const filters = {
    title: title,
    description: description,
    genre: genre,
    rating: rating
  }
  const setFilters = {
    setTitle: setTitle,
    setDescription: setDescription,
    setGenre: setGenre,
    setRating: setRating
  }

  useEffect(() => {
    let skip = (currentPage - INITIAL_PAGE) * PRODUCTS_PER_PAGE;
    const fetchMovies = async () => {
      try {
        // Content type application json
        const url = new URL(`http://127.0.0.1:8000/api/films/all/`)
        const params = new URLSearchParams();
        if (title) params.append('title', title);
        if (description) params.append('description', description);
        if (genre) params.append('genre', genre);
        if (rating) params.append('rating', rating);
        
        url.search = params.toString();
        const response = await fetch(url);
        
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
  }, [currentPage, title, description, genre, rating]);

  return (
      <PageList
        movieList={movieList}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        filters={filters}
        setFilters={setFilters}
      />      
  )
}

export default App
