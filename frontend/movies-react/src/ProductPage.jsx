import React from 'react';
import { useLoaderData } from "react-router-dom";
// import { useState, useEffect } from 'react';

export default function ProductPage() {
  let product = useLoaderData();
  console.log(product)
  
  // const [product, setProduct] = useState({});

  // useEffect(() => {  
  //   const fetchProduct = async () => {
  //     try {
  //       const response = await fetch(`https://dummyjson.com/products/${product.id}`);
  //       if (!response.ok) {
  //         throw new Error('No se pudo obtener la lista de productos');
  //       }
  //       const product_data = await response.json();
  //       setProduct(product_data);
  //     } catch (error) {
  //       console.error('Error al obtener los productos:', error);
  //     }
  //   };

  //   fetchProduct();
  // }, []);
  
  // const product = data;
  return (
    <div className="container">
      <div className="product-details" id="productDetails">
        <img src={product.thumbnail} alt="Thumbnail" id="thumbnail"/>
        <div className="info">
          <h2>{product.title}</h2>
          <p>{product.description}</p>
          <p><strong>Categoría:</strong> <span>{product.category}</span></p>
          <p><strong>Marca:</strong> <span>{product.brand}</span></p>
          <p><strong>Precio:</strong> <span>{product.price}€</span></p>
          <p><strong>Descuento:</strong> <span>{product.discountPercentage}%</span></p>
          <p><strong>Precio Final:</strong> <span>{(product.price * (1 - product.discountPercentage/100)).toFixed(2)}$</span></p>
          <p><strong>Stock:</strong> <span>{product.stock}</span></p>
          <p><strong>Valoración:</strong> <span>{product.rating} / 5</span></p>
        </div>
      </div>
      <p><strong>More Images</strong></p>
      <div className="more-images">
          {product.images.map(link => (
            <img key={link} src={link} alt={`Image ${link}`} />
          ))}
      </div>
    </div>
  )
};

