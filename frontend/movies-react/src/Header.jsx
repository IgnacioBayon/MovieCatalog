import {NavLink} from 'react-router-dom';

export default function Header() {
    // Get the cookie to check if the user is logged in
    const cookie = document.cookie;

    return (<header>
        <h1>FilmAffinity</h1>
        <nav>
          <ul>
            <li>
              <NavLink to="/">Movie List</NavLink>
            </li>
            {/* If the user is logged in, show "Profile". If not, show "Sign in" */}
            {cookie.includes("sessionid") ? <li>
              <NavLink to="/profile">Profile</NavLink>
            </li> : <li>
              <NavLink to="/login">Sign in</NavLink>
            </li>}
          </ul>
        </nav>
    </header>);
}