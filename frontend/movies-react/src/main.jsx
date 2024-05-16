import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import PageList from './PageList.jsx'
import PageMovie from './PageMovie.jsx'
import PageRegister from './PageRegister.jsx'
import PageLogin from './PageLogin.jsx'
import PageLogout from './PageLogout.jsx'
import PageProfile from './PageProfile.jsx'
import PageProfileEdit from './PageProfileEdit.jsx'
import PageDeleteUser from './PageProfileDelete.jsx'
import PageError from './PageError.jsx'
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
  }, {
    path: "/logout",
    element: <PageLogout/>,
  }, {
    path: "profile/delete",
    element: <PageDeleteUser/>,
  }, {
  path: "/",
  element: <App/>,
  children: [{
    path: "",
    element: <PageList/>,
  }, {
    path: "profile",
    element: <PageProfile/>,
  }, {
    path: "profile/edit",
    element: <PageProfileEdit/>,
    action: changeProfileData
  }, {
    path: "films/:id",
    element: <PageMovie/>,
    errorElement: <PageError/>,
    loader: async ({ params }) => {
      return await fetch(`http://127.0.0.1:8000/api/films/${params.id}/`)
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
    credentials: 'include',
  });
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

async function changeProfileData({ request }) {
  const formData = await request.formData();
  const {name, email, tel, password} = Object.fromEntries(formData);
  const response = await fetch('http://127.0.0.1:8000/api/users/me/', {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      nombre: name,
      email: email,
      tel: tel,
      password: password}),
    credentials: 'include',
  });
  if (response.ok) return redirect('/profile');
  return {status: response.status};
}
