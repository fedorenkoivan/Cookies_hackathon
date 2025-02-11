import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.scss";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar__left">
        <Link to="/" className="navbar__link">
          C&#127850;&#127850;kies
        </Link>
      </div>

      <div className="navbar__search">
        <FaSearch className="navbar__search-icon" />
        <input
          type="text"
          placeholder="Search"
          className="navbar__search-input"
        />
      </div>

      <div className="navbar__buttons">
        <button className="navbar__button"
        onClick={() => navigate('/log-in')}>
          Log in
        </button>
        <button className="navbar__button navbar__button--primary"
        onClick={() => navigate('/sign-up')}>
          Sign Up
        </button>
      </div>
    </nav>
  );
};

export default Navbar