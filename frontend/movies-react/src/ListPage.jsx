import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
// import Header from "./Header.jsx"
// import Footer from "./Footer.jsx"

const INITIAL_PAGE = 1;
const END_PAGE = 20;
const PRODUCTS_PER_PAGE = 3;

function ListPage({productList, currentPage, setCurrentPage, minStock, setMinStock}) {
  return (<div className="container">
    <h2>Nuestros Productos</h2>
    <Filters
      productList={productList}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      minStock={minStock}
      setMinStock={setMinStock}
    />
    <ProductList productList={productList} minStock={minStock}/>
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

function ProductList({productList, minStock}) {
  return (<div>
    {productList.map(product => 
    // Remove the link appearance and not blue color
      <NavLink to={`/product/${product.id}`} key={product.id} style={{textDecoration: 'none', color: 'black'}}>
        <Product product={product}/>
      </NavLink>)}
  </div>);
}

function Product({product}) {
  return (
    <div className="product-details" id="productDetails">
      <img src={product.thumbnail} alt="Thumbnail" id="thumbnail"/>
      <div className="info">
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        <p>
          <strong>Precio:</strong> <span>{product.price}€</span>
        </p>
        <p>
          <strong>Stock:</strong> <span>{product.stock}</span>
        </p>
      </div>
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);
  const [productList, setProductList] = useState([]);
  const [minStock, setMinStock] = useState(1);

  useEffect(() => {
    let skip = (currentPage - INITIAL_PAGE) * PRODUCTS_PER_PAGE;
    const fetchMovies = async () => {
      try {
        const response = await fetch(`https://dummyjson.com/products`);
        if (!response.ok) {
          throw new Error('No se pudo obtener la lista de productos');
        }
        const data = await response.json();
        data.products = data.products.filter(product => product.stock >= minStock);
        data.products = data.products.slice(skip, skip + PRODUCTS_PER_PAGE);
        setProductList(data.products);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };

    fetchProducts();
  }, [currentPage, minStock]);

  return (
      // <Header/>
      <ListPage
        productList={productList}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        minStock={minStock}
        setMinStock={setMinStock}
      />
      // <Footer/>
  )
}

export default App
