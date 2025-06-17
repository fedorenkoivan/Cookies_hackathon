import "./Footer.scss";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const contributors = [
    { name: "Loban Mykhailo", github: "https://github.com/LobanMihajlo" },
    { name: "Mariia Khorunzha", github: "https://github.com/Impe11e" },
    { name: "Maksym Kramarenko", github: "https://github.com/Maks9m" },
    { name: "Ivan Fedorenko", github: "https://github.com/fedorenkoivan" },
  ];

  return (
    <footer>
      <div className="footer-content">
        <div className="contributors-section">
          <h3>Contributors</h3>
          <div className="contributors-grid">
            {contributors.map((contributor, index) => (
              <a
                key={index}
                href={contributor.github}
                className="contributor-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-github"></i>
                <span>{contributor.name}</span>
              </a>
            ))}
          </div>
        </div>

        <p className="copyright">
          © {currentYear} Cookies Team. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
