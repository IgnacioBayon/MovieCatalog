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
        <h2>Hello, {profileData.nombre}</h2>
        <div className="info">
          <p>
            <strong>Email:</strong> {profileData.email}
          </p>
          <p>
            <strong>Phone:</strong> {profileData.tel}
          </p>
          <NavLink to="/profile/edit">
            <button>Edit profile</button>
          </NavLink>  
          <NavLink to="/profile/delete">
            <button>Delete profile</button>
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