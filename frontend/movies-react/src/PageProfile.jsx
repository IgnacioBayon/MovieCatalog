import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

export default function PageProfile() {
    const [profileData, setProfileData] = useState({});
    useEffect(() => {
      getProfileData({ setProfileData });
    }, []);

    return (
      // Show the user's information: name, email and phone number
      <div className="container">
        <h3>Hello, {profileData.nombre}</h3>
        <div className="info">
          <p>
            Your Data:<br/>
            <ul>
              <li><strong>E-mail:</strong> {profileData.email}</li>
              <li><strong>Phone:</strong> {profileData.tel}</li>
            </ul>
          </p>
          <NavLink to="/profile/edit">
            <button id="edit"><strong>Edit Profile</strong></button>
          </NavLink>  
          <NavLink to="/profile/delete">
            <button id="delete"><strong>Delete Account</strong></button>
          </NavLink>
        </div>
      </div>
    );
};


export async function getProfileData({ setProfileData }) {
  const response = await fetch("http://127.0.0.1:8000/api/users/me/", {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
      },
      credentials: "include",
  });
  const data = await response.json();
  setProfileData(data);
}