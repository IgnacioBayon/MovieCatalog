import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Header() {
    // Check if the current path is the profile page
    const location = useLocation();
    const isProfilePage = location.pathname.endsWith("/profile");
    const [isLoggedIn, setIsLoggedIn] = useState(null); // Use state to store login status
    
    
    useEffect(() => {
        getIsLoggedIn({ setIsLoggedIn });
    }, []);

    return (<header>
        <h1>DunderMifflin Films</h1>
        <nav>
          <ul>
            <li>
              <NavLink to="/">Movie List</NavLink>
            </li>
            {/* If the user is logged in, show "Profile" or "Logout" based on the current path. If not, show "Sign in" */}
            {isLoggedIn ? (
              <>
                {isProfilePage ? (
                  <li>
                    <NavLink to="/logout">Logout</NavLink>
                  </li>
                ) : (
                  <li>
                    <NavLink to="/profile">Profile</NavLink>
                  </li>
                )}
              </>
            ) : (
              <li>
                  <NavLink to="/login">Sign in</NavLink>
              </li>
            )}
          </ul>
        </nav>
    </header>);
}


async function getIsLoggedIn({ setIsLoggedIn }) {
  try {
      const response = await fetch("http://127.0.0.1:8000/api/users/me/", {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          },
          credentials: "include",
      });
      if (!response.ok) {
        setIsLoggedIn(false);
        return
      }
      setIsLoggedIn(true);
  } catch (error) {
      setIsLoggedIn(false);
  }
}