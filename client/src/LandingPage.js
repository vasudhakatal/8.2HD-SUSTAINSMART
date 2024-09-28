import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import './LandingPage.css';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="container">
          <div className="logo">
            <h2>Sustain Smart</h2>
          </div>
          <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            <ul>
              <li><Link to="#home">Home</Link></li>
              <li><Link to="#features">Features</Link></li>
              <li><Link to="#cta">Get Started</Link></li>
              <li><Link to="#contact">Contact</Link></li>
              <li><Link to="/login">Admin Login</Link></li>
            </ul>
          </div>
          <div className="hamburger" onClick={toggleMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </nav>

      <header className="header" id="home">
        <h1>Sustain Smart for You</h1>
        <h2>Smarter Choices for Sustainable Features</h2>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <img
          src="https://lh3.googleusercontent.com/fife/ALs6j_GR9kkvMKBzpsP1cLHpfRVjpVsU0H1IqDWtyJflgZ4Oajij6uFFQDqkT_XpBki62yQKRv7EeqSTq9We71iFsVtRuNpMDHPAHeawmDmVhujFtveLPZEvApWON1snMD0sBlTeAxClDQFGjO2ElVQtMSaku_QTZUtv6RD2L-b3-q6_791nkUwJkZg182A4jxMEE-VYMhoT8gf4YOPliW1jPl1XK5IdM0pL2K5sEmOwPW45lUi7X6CK9mM4vlEKgtcm-1ZPZ1O8eFasXK7I_LriFdIpTd69LM4f460Z0oEHIRdyof8wAIWVzIDRvOXL5i7ksZlQVnSrENeSkQIAoMpatxxkN2iHifORwwY0rxrdohSR2is8b529fB-nwyudjDLP1RA2ZnAVxaVkbhcnSUzkJRlyYVjOQpTAwrEP7gDZOmmn0WoBkirYL43fIqlKsrIQds2HJicd0TrVYdIoJd5x2w6r83UvAFcg22IkPVWEah4-Q4O94QJgeX9ZrxW6NnWeaeQciG4t2S3CTVo8llQCl3rTCFD0Rj76oVkdUZCd6QSK9I9PS3p13CrhO08ijpPcnGTi2v8vE5lF_IY1Vh07MlYTsLsQ41iHkKwiaYthKKFmQk24NZhOR2xZJ5WUu85XmaXOxPx2r2IzhTtKTb7vwNMAPot0mCrE3gpLR8iTUWyxvuBGgf_E0urmzAnJ6F2G1sCq5y62k7RQZxO6xBzG1_azhxVTxzfJXWqwtxtuLwRxZA_0vJogCMAqdhQn8Iqqfz2p2lG1yPXqddM4-D2Co-j2FiIlBNhnHDJlemGKy1ERQXVm56b9w0gteOv7Vr2IK2FLdbESzraTWaBWk-FPvPHtI92TojPssuZOA64DKn1ZGpRTSaDxzR4eTdDKs4ldqw7f0IPXqEJ-WyTGdLZCBQd0tC0gSteekWOam34Lz-k2ZsG38LYyqKFsRuFmTTI63M3VLQOnfkHFvkOs9fKQDtWezwoBv-guOeGwizCPxzh7cBtsKBZE1admTITGd26-v5N4CmQCgjLpA-w5C-PR_cD_8QwzVqe7jSpmzl8uz0aQB3uhfqn_YXlOKEglm9Da8hvtd8ZXB-5vhsGFEthr26bwg7H-sQjm8PFF1IZpyf4WQJjR0xt0Z75Gdi9K1M51R3B0HcivsxyFHqFcUvcXqxzmOOs8rXVZIP9damO5iUyAeW_IGC5u8VbRje0fTQj1hJ01-UoTP3QAdL3beSqfq6Mn5oRKa8wxOTvt0sg7nbeiPxihq3eWsAQJ0WakDOsifjQoFArH9Ye28ZvIRf4Qwh-zKQ=s512"
          alt="Smart kitchen interface showing food freshness tracking"
          className="hero-image"
        />
        <div className="benefit-summary">
          <p>
            Our innovative app helps you track food freshness, plan meals, and
            reduce waste effortlessly. Save money, help the environment, and
            enjoy a more organized kitchen.
          </p>
        </div>
      </section>
      
      {/* 2 */}
      <section className="hero-2">
        <div className="benefit-summary-2">
          <p>
            Seamlessly connect with your smart devices to automatically track
            and manage food inventory, ensuring nothing goes to waste and making
            meal planning even simpler.
          </p>
        </div>
        <img
          src="https://lh3.googleusercontent.com/fife/ALs6j_ECxu3wqbnWL97FTsWZ9vK90xMGXPPWU_Go-3NBw59hFidRuE2AozCcFq5CIS7VLeF-nKsKIDZo2oFQnwVo7ZDRnTK0W8HlyBq56DfbAYBgI-pOXM_a2DDf3O6QWlHTJtPPG9D1WDbNDjAP0Xm_xKoBLPe5vavIZ7QKH6uw1xVEOoDwClaiAk7YODhog8M-LIiKPMdHgOC2KDHWyeqU-eF4JvsMz5qu74qSJl5b8fcFQCXINOGrD-HvIyxjAobP-b-qIa3Sd73vMweOgLlBcBrhPryB-Lv7MX3DL7zLAQq5SB9p_ecQEbHRhFp8hyoeYMohd_vjK6lkf6gUdPTrm-YCKN-G8QqeBgrjWd6WuLcbetma7gb0nXt_4glV7whsHMy5fS4RR0RKyfE7RKHHB6CXzG3hZPo2S3tnyM_CSrmwFTNgwyOFBR9g8GDnz1KmmT-S-_GzMLQQmapSlPHD0gTWkIvH3T3WhDqLfNd5MKrTbhjjz9GSfUJcZ4d45Ox0RLpdCZd7o_SrnWm7EB2Wgh93jlat4e9MykqJmwXHvjBkOyBimw21balvDX7qzPgufce8Ef32GEhZmDoi0uu45FEOiY4R65iUNBt6xzebgQil7LQJt5JXw3FQcq-kuLr_OPxR5ulvbjrkyhfzDfABoHZUOC13m1Pe5Es4DTMsDbXo2yNPTD51DbDDe9wbwhC7RRY1HZ9ztnU9q6dv1HFW7tX9zmLNyF1c6N8hbXEpIh5GBYcbfg-c-_8beFGa1-8zp7WOlB3qRJooKALQgx1epukWlIUSpRQ-_7_lTtRa_oqBXnTD1PeuItUgnDujgw2Zjtw7pNdbMn1bWtp9s4kIfbr24Aw4dptS9hDRxTAnZ5zEsy1m71UBTXn1cnIBsU1R8sry3UtmbJyd39p52WfyYv-qgFrZB1MKo3d8p9Veexw8TY40dkCXYxkYspK3N11SySOsoWEnmEmSx7M4Gg=s512"
          alt="Smart fridge tracking food freshness"
          className="hero-image-2"
        />
      </section>

      {/* Call to Action */}
      {/* Call to Action */}
      <section className="cta" id="cta">
        <h3>Start Your Free Trial Today!</h3>
        <button className="cta-button">
          Join the movement to reduce food waste
        </button>
      </section>

      {/* Benefits Section */}
      <section className="benefits" id="features">
        <h3>Why Choose Us?</h3>
        <ul>
          <li>Save Money: Reduce food waste and save on groceries.</li>
          <li>Eco-Friendly: Minimize your carbon footprint.</li>
          <li>Organized Kitchen: Get notified when food is about to expire.</li>
          <li>Custom Recipes: Get meal ideas using what you already have.</li>
          <li>Business Solution: Track inventory and donate excess food.</li>
        </ul>
      </section>

      {/* Social Proof Section */}
      <section className="social-proof">
        <h3>What Our Users Say</h3>
        <div className="testimonial">
          <blockquote>
            <p>
              “This app has completely transformed how I manage my kitchen. I’m
              saving money and reducing waste. Highly recommended!” – Regina
              Phalenge
            </p>
          </blockquote>
        </div>
        <div className="testimonial">
          <blockquote>
            <p>
              “A fantastic tool for any environmentally-conscious home. It’s
              user-friendly and effective!” – Ken Adams
            </p>
          </blockquote>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer" id="contact">
        <div className="newsletter">
          <h4>Subscribe to Our Newsletter</h4>
          <form>
            <input type="email" placeholder="Enter your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
        <div className="footer-info">
          <h4>Contact Us</h4>
          <p>Email: support@smartfoodmanagement.com</p>
          <p>Phone: +61 2 9876 5432</p>
          <p>Address: 456 Blue Lane, Greenborough, VIC 3088, Australia</p>
          <p>
            Follow us on
            <span className="social-icons">
              <a target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a target="_blank" rel="noopener noreferrer">
                <i className="fab fa-x"></i>
              </a>
              <a target="_blank" rel="noopener noreferrer">
                <i className="fab fa-youtube"></i>
              </a>
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
