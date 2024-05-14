import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Header() {
    // Check if the current path is the profile page
    const location = useLocation();
    const isProfilePage = location.pathname.endsWith("/profile/");

    // Get the cookie to check if the user is logged in
    const [cookie, setCookie] = useState("")
    useEffect(() => {
        setCookie(document.cookie);
    }, []);
    

    console.log("cookie", cookie);
    console.log("isProfilePage", isProfilePage);
    return (<header>
        <h1>FilmAffinity</h1>
        <nav>
          <ul>
            <li>
              <NavLink to="/">Movie List</NavLink>
            </li>
            {/* If the user is logged in, show "Profile" or "Logout" based on the current path. If not, show "Sign in" */}
            {cookie.includes("session") ? (
              <>
                {isProfilePage ? (
                  <li>
                    <NavLink to="/logout/">Logout</NavLink>
                  </li>
                ) : (
                  <li>
                    <NavLink to="/profile/">Profile</NavLink>
                  </li>
                )}
              </>
            ) : (
              <li>
                  <NavLink to="/login/">Sign in</NavLink>
              </li>
            )}
          </ul>
        </nav>
    </header>);
}