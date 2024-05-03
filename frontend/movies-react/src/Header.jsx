import {NavLink} from 'react-router-dom';

export default function Header() {
    return (<header>
        <h1>FilmAffinity</h1>
        <nav>
          <ul>
            <li>
              <NavLink to="/">Movie List</NavLink>
            </li>
            <li>
              <NavLink to="/contactInfo">Profile</NavLink>
            </li>
          </ul>
        </nav>
    </header>);
}