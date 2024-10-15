import React, { useState } from "react";
import { Link } from "react-router-dom"; // Remove useNavigate since we don't need it
import "./LandingPage.css";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to handle newsletter subscription
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/send-newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipients: [email],
          subject: "Subscription Confirmation",
          text: "Thank you for subscribing to our newsletter!",
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Subscription successful! Check your inbox.");
      } else {
        setMessage(result.error || "Subscription failed. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="container">
          <div className="logo">
            <h2 className="hea" href = "/">Sustain Smart</h2>
          </div>
          <div className={`nav-links ${isMenuOpen ? "open" : ""}`}>
            <ul>
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#cta">Get Started</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </ul>
          </div>
          <div className="hamburger" onClick={toggleMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </nav>

      {/* This section is already treated as the homepage */}
      <header className="header" id="home">
        <h1>Sustain Smart for You</h1>
        <h2 className="hea">Smarter Choices for Sustainable Features</h2>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <img
          src={require("./1.png")}
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

      {/* Another Hero Section */}
      <section className="hero-2">
        <div className="benefit-summary-2">
          <p>
            Seamlessly connect with your smart devices to automatically track
            and manage food inventory, ensuring nothing goes to waste and making
            meal planning even simpler.
          </p>
        </div>
        <img
          src={require("./2.png")}
          alt="Smart fridge tracking food freshness"
          className="hero-image-2"
        />
      </section>

      {/* Call to Action Section */}
      <section className="cta" id="cta">
        <h3>Start Your Free Trial Today!</h3>
        <button
          className="cta-button"
          onClick={() => (window.location.href = "/login")}
        >
          Join the movement to reduce food waste
        </button>
      </section>

      {/* Features Section */}
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

      {/* Testimonials Section */}
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
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Subscribe</button>
          </form>
          {message && <p>{message}</p>}
        </div>

        <div className="footer-info">
          <h4>Contact Us</h4>
          <p>Email: sustainsmart824@gmail.com</p>
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
