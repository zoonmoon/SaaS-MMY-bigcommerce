'use client'
import './hero.css';

export default function HeroBanner() {
  return (
    <div className="hero-banner">
      <img
        src="/default-images/home-page-bg.png" // Adjust path as needed
        alt="Hot tub spa parts"
        className="hero-image"
      />
      <div className="hero-overlay">
        <h1 className="hero-title">  Add a Smart Fitment Tool to Your Hot Tub & Spa Store</h1>
        <p className="hero-subtitle">
          Help your customers find the exact parts they need by installing our Year-Make-Model search tool — built specifically for spa and hot tub ecommerce stores.
        </p>
        <button className="hero-button" onClick={() => window.location='/contact-us'}> Get Started for Your BigCommerce Store</button>
      </div>
    </div>
  );
}
