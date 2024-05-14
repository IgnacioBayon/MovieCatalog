import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import PageList from './PageList.jsx'
import PageMovie from './PageMovie.jsx'
import PageError from './PageError.jsx'
import PageProfile from './PageProfile.jsx'
import PageLogin from './PageLogin.jsx'
import PageRegister from './PageRegister.jsx'
import './index.css'
import { redirect, createBrowserRouter, RouterProvider } from "react-router-dom";


const router = createBrowserRouter([{
    path: "/login",
    element: <PageLogin/>,
    action: loginUser,
  }, {
    path: "/register",
    element: <PageRegister/>,
    action: registerUser,
  },{
  path: "/",
  element: <App/>,
  children: [{
    path: "",
    element: <PageList/>,
  },{
    path: "profile",
    element: <PageProfile/>,
  }, {
    path: "films/:id",
    element: <PageMovie/>,
    errorElement: <PageError/>,
    loader: async ({ params }) => {
      return await fetch(`http://127.0.0.1:8000/api/films/${params.id}`)
    },
  }],
}]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <RouterProvider router={router} />
  </React.StrictMode>,
)

async function loginUser({ request }) {
  const formData = await request.formData();
  const {email, password} = Object.fromEntries(formData);
  const loginResponse = await fetch('http://127.0.0.1:8000/api/users/login/', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email, password}),
  });
  console.log(loginResponse)
  if (loginResponse.ok) return redirect('/profile');
  return {status: loginResponse.status};
}

async function registerUser({ request }) {
  const formData = await request.formData();
  const {nombre, tel, email, password} = Object.fromEntries(formData);
  const registerResponse = await fetch('http://127.0.0.1:8000/api/users/', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({nombre, tel, email, password}),
  });
  if (registerResponse.ok) return redirect('/login');
  return {status: registerResponse.status};
}
